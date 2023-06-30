import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Alert, TextInput } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  AppDialog,
  ListItemLine,
  ScanButton,
  navBackButton,
  SimpleDialog,
} from '@lib/mobile-ui';

import { generateId, getDateString, keyExtractor, useSendDocs, sleep, useSendOneRefRequest } from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FlashList } from '@shopify/flash-list';

import { barcodeSettings, IReceiptDocument, IReceiptLine, IShipmentDocument } from '../../store/types';
import { ReceiptStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import { alertWithSound, getBarcode, getLineGood, getRemGoodListByContact } from '../../utils/helpers';
import { IGood, IRemains, IRemGood } from '../../store/app/types';

import ViewTotal from '../../components/ViewTotal';

export interface IScanerObject {
  item?: IReceiptLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}

export const ReceiptViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<ReceiptStackParamList, 'ReceiptView'>>();
  const isFocused = useIsFocused();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const id = useRoute<RouteProp<ReceiptStackParamList, 'ReceiptView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IReceiptDocument>(id);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;
  const loading = useSelector((state) => state.app.loading);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);
  const lineSum = lines?.reduce(
    (sum, line) => {
      return { ...sum, quantPack: sum.quantPack + (line.quantPack || 0), weight: sum.weight + (line.weight || 0) };
    },
    { quantPack: 0, weight: 0 },
  );

  const isBlocked = doc?.status !== 'DRAFT';

  const goods = refSelectors.selectByName<IGood>('good').data;
  const settings = useSelector((state) => state.settings?.data);

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;

  const docList = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return doc?.head?.fromDepart?.id && isFocused
      ? getRemGoodListByContact(goods, remains[doc.head.fromDepart.id], docList, doc.head.fromDepart.id)
      : [];
  }, [doc?.head?.fromDepart?.id, docList, goods, isFocused, remains]);

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('ReceiptEdit', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setScreenState('deleting');
          await sleep(1);
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setScreenState('deleted');
          } else {
            setScreenState('idle');
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id]);

  const handleFocus = () => {
    ref?.current?.focus();
  };

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = doc?.lines?.[0]?.id;
    if (lastId) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
    }
    handleFocus();
  }, [dispatch, doc?.lines, id]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const sendRemainsRequest = useSendOneRefRequest('Остатки', { name: 'remains' });

  const handleSendRemainsRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRemainsRequest();
  }, [sendRemainsRequest]);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    handleSendRemainsRequest();
    setScreenState('sent');
  }, [handleSendRemainsRequest, sendDoc]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Ввести штрих-код',
        onPress: handleShowDialog,
      },
      {
        title: 'Отменить последнее сканирование',
        onPress: hanldeCancelLastScan,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditDocHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditDocHead, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
          <ScanButton
            onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('ScanGood', { docId: id }))}
            disabled={screenState !== 'idle'}
          />
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ),
    [actionsMenu, id, isBlocked, isScanerReader, loading, navigation, screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  //////////////////////// Не удалять //////////////////////////////////
  // const linesList = doc.lines?.reduce((sum: IReceiptLine[], line) => {
  //   if (!sum.length) {
  //     sum.push(line);
  //   }

  //   if (sum.find((i) => i.id !== line.id)) {
  //     const lineSum = sum.find((i) => i.good.id === line.good.id && i.numReceived === line.numReceived);
  //     if (lineSum) {
  //       const lineTotal: IReceiptLine = { ...lineSum, weight: round(lineSum.weight + line.weight) };
  //       sum.splice(sum.indexOf(lineSum), 1, lineTotal);
  //     } else {
  //       sum.push(line);
  //     }
  //   }
  //   return sum;
  // }, []);

  const renderItem = useCallback(({ item }: { item: IReceiptLine }) => {
    return (
      <ListItemLine key={item.id} readonly={true}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <View style={styles.flexDirectionRow}>
            <MaterialCommunityIcons name="shopping-outline" size={18} />
            <MediumText> {(item.weight || 0).toString()} кг</MediumText>
          </View>
          <View style={styles.flexDirectionRow}>
            <MediumText>
              Партия № {item.numReceived || ''} от {getDateString(item.workDate) || ''}
            </MediumText>
          </View>
        </View>
      </ListItemLine>
    );
  }, []);

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      alertWithSound(text);
      setScanned(false);
    }
  }, []);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (doc?.status !== 'DRAFT') {
        return;
      }

      if (!brc.match(/^-{0,1}\d+$/)) {
        handleErrorMessage(visibleDialog, 'Штрих-код не определён. Повторите сканирование!');
        return;
      }

      if (brc.length < minBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!',
        );
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const lineGood = getLineGood(barc.shcode, barc.weight, goods, goodRemains, remainsUse);

      if (!lineGood.good) {
        handleErrorMessage(visibleDialog, 'Товар не найден!');
        return;
      }

      if (!lineGood.isRightWeight) {
        handleErrorMessage(visibleDialog, 'Вес товара превышает вес в остатках!');
        return;
      }

      const line = doc.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        handleErrorMessage(visibleDialog, 'Данный штрих-код уже добавлен');
        return;
      }

      const newLine: IReceiptLine = {
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,

        sortOrder: doc.lines?.length + 1,
      };

      dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));

      if (visibleDialog) {
        setVisibleDialog(false);
        setErrorMessage('');
        setBarcode('');
      } else {
        setScanned(false);
      }
    },

    [
      doc,
      minBarcodeLength,
      goodBarcodeSettings,
      goods,
      goodRemains,
      remainsUse,
      dispatch,
      id,
      visibleDialog,
      handleErrorMessage,
    ],
  );

  const handleSearchBarcode = () => {
    getScannedObject(barcode);
  };

  const [key, setKey] = useState(1);

  const setScan = (brc: string) => {
    setKey(key + 1);
    setScanned(true);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (!visibleDialog && !scanned && ref?.current) {
      ref?.current &&
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, ONE_SECOND_IN_MS);
    }
  }, [scanned, ref, visibleDialog]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting' || screenState === 'sending') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>{screenState === 'deleting' ? 'Удаление документа...' : 'Отправка документа...'}</LargeText>
          <AppActivityIndicator style={{}} />
        </View>
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
        isBlocked={isBlocked}
      >
        <>
          <MediumText style={styles.rowCenter}>
            {`№ ${doc.number} от ${getDateString(doc.documentDate)}` || ''}
          </MediumText>
          <MediumText style={styles.rowCenter}>Откуда: {doc.head.fromDepart?.name || ''}</MediumText>
          <View style={styles.rowCenter}>
            <MediumText>Куда: {doc.head.toDepart?.name || ''}</MediumText>
          </View>
        </>
      </InfoBlock>
      <TextInput
        style={styles.scanInput}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      <FlashList
        data={lines}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        extraData={[lines, isBlocked]}
        keyboardShouldPersistTaps={'always'}
      />
      {doc?.lines?.length ? <ViewTotal quantPack={lineSum?.quantPack || 0} weight={lineSum?.weight || 0} /> : null}
      <AppDialog
        title="Введите штрих-код"
        visible={visibleDialog}
        text={barcode}
        onChangeText={setBarcode}
        onCancel={handleDismissBarcode}
        onOk={handleSearchBarcode}
        okLabel={'Найти'}
        errorMessage={errorMessage}
      />
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Вы уверены, что хотите отправить документ?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
    </View>
  );
};
