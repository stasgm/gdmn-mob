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

import { barcodeSettings, IMoveDocument, IMoveLine } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import { getBarcode } from '../../utils/helpers';
import { IAddressStoreEntity, IGood } from '../../store/app/types';

import ViewTotal from '../../components/ViewTotal';

export interface IScanerObject {
  item?: IMoveLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}

export const MoveViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const id = useRoute<RouteProp<MoveStackParamList, 'MoveView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IMoveDocument>(id);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;
  const loading = useSelector((state) => state.app.loading);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);
  const lineSum = lines?.reduce((sum, line) => sum + (line.weight || 0), 0) || 0;

  const isBlocked = doc?.status !== 'DRAFT';

  const goods = refSelectors.selectByName<IGood>('good').data;
  const settings = useSelector((state) => state.settings?.data);
  const departs = refSelectors.selectByName<IAddressStoreEntity>('depart').data;

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('MoveEdit', { id });
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

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = doc?.lines?.[0]?.id;
    if (lastId) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
    }
  }, [dispatch, doc?.lines, id]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const sendRequest = useSendOneRefRequest('Ячейки', { name: 'cell' });

  const handleSendDebtRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRequest();
  }, [sendRequest]);
  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    handleSendDebtRequest();
    setScreenState('sent');
  }, [handleSendDebtRequest, sendDoc]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Отправить запрос на получение справочника ячеек',
        onPress: handleSendDebtRequest,
      },
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
  }, [showActionSheet, handleSendDebtRequest, hanldeCancelLastScan, handleEditDocHead, handleDelete]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
      ) : (
        <View style={styles.buttons}>
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
          {!isScanerReader && (
            <ScanButton
              onPress={() => navigation.navigate('ScanGood', { docId: id })}
              disabled={screenState !== 'idle'}
            />
          )}
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
  // const linesList = doc.lines?.reduce((sum: IMoveLine[], line) => {
  //   if (!sum.length) {
  //     sum.push(line);
  //   }

  //   if (sum.find((i) => i.id !== line.id)) {
  //     const lineSum = sum.find((i) => i.good.id === line.good.id && i.numReceived === line.numReceived);
  //     if (lineSum) {
  //       const lineTotal: IMoveLine = { ...lineSum, weight: round(lineSum.weight + line.weight) };
  //       sum.splice(sum.indexOf(lineSum), 1, lineTotal);
  //     } else {
  //       sum.push(line);
  //     }
  //   }
  //   return sum;
  // }, []);

  const renderItem = useCallback(
    ({ item }: { item: IMoveLine }) => {
      return (
        <ListItemLine
          key={item.id}
          readonly={isBlocked}
          // readonly={!(doc?.head.subtype.id === 'prihod') || isBlocked}
          onPress={() => navigation.navigate('SelectCell', { docId: id, item, mode: 1 })}
        >
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
            {doc?.head.fromDepart.isAddressStore ? (
              <View style={styles.flexDirectionRow}>
                <MediumText>Откуда: {item.fromCell || ''}</MediumText>
              </View>
            ) : null}
            {doc?.head.toDepart.isAddressStore ? (
              <View style={styles.flexDirectionRow}>
                <MediumText>
                  {doc?.head.fromDepart.isAddressStore ? 'Куда:' : 'Ячейка №'} {item.toCell || ''}
                </MediumText>
              </View>
            ) : null}
          </View>
        </ListItemLine>
      );
    },
    [doc?.head, id, isBlocked, navigation],
  );

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (!brc.match(/^-{0,1}\d+$/)) {
        if (visibleDialog) {
          setErrorMessage('Штрих-код неверного формата');
        } else {
          Alert.alert('Внимание!', 'Штрих-код не определен. Повторите сканирование!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      if (brc.length < minBarcodeLength) {
        if (visibleDialog) {
          setErrorMessage('Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!');
        } else {
          Alert.alert(
            'Внимание!',
            'Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!',
            [{ text: 'OK' }],
          );
          setScanned(false);
        }
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      if (!good) {
        if (visibleDialog) {
          setErrorMessage('Товар не найден');
        } else {
          Alert.alert('Внимание!', 'Товар не найден!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      const line = doc.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        if (visibleDialog) {
          setErrorMessage('Товар уже добавлен');
        } else {
          Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      const newLine: IMoveLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode, goodGroupId: good.goodGroupId },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,

        sortOrder: doc.lines?.length + 1,
      };

      const isFromAddressed = departs.find((i) => i.id === doc.head.fromDepart.id && i.isAddressStore);
      const isToAddressed = departs.find((i) => i.id === doc.head.toDepart.id && i.isAddressStore);

      if (doc.head.toDepart.isAddressStore || doc.head.fromDepart.isAddressStore || isFromAddressed || isToAddressed) {
        if (newLine.quantPack < goodBarcodeSettings.boxNumber) {
          Alert.alert('Внимание!', `Вес поддона не может быть меньше ${goodBarcodeSettings.boxNumber}!`, [
            { text: 'OK' },
          ]);
          setScanned(false);
          return;
        }
        navigation.navigate('SelectCell', { docId: id, item: newLine, mode: 0 });
      } else {
        dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
      }

      if (visibleDialog) {
        setVisibleDialog(false);
        setErrorMessage('');
        setBarcode('');
      } else {
        setScanned(false);
      }
    },

    [doc, minBarcodeLength, goodBarcodeSettings, goods, departs, visibleDialog, navigation, id, dispatch],
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

  const isFocused = useIsFocused();
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
        title={doc.head.subtype.name || ''}
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
        keyboardShouldPersistTaps={'handled'}
      />
      {doc?.lines?.length ? <ViewTotal quantity={lineSum || 0} weight={lines?.length || 0} /> : null}
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
