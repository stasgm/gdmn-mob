import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Keyboard } from 'react-native';
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
  AppDialog,
  LargeText,
  ListItemLine,
  ScanButton,
  navBackButton,
  SaveDocument,
  SimpleDialog,
} from '@lib/mobile-ui';

import {
  generateId,
  getDateString,
  keyExtractor,
  useSendDocs,
  sleep,
  useSendOneRefRequest,
  round,
} from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FlashList } from '@shopify/flash-list';

import { barcodeSettings, IFreeShipmentDocument, IFreeShipmentLine, IShipmentDocument } from '../../store/types';
import { FreeShipmentStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import {
  alertWithSound,
  alertWithSoundMulti,
  getBarcode,
  getBarcodeString,
  getLineGood,
  getRemGoodListByContact,
} from '../../utils/helpers';
import { IBarcode, IGood, IRemains, IRemGood } from '../../store/app/types';

import ViewTotal from '../../components/ViewTotal';

export interface IScanerObject {
  item?: IFreeShipmentLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}

export const FreeShipmentViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<FreeShipmentStackParamList, 'FreeShipmentView'>>();
  const isFocused = useIsFocused();

  const { id, isCurr } = useRoute<RouteProp<FreeShipmentStackParamList, 'FreeShipmentView'>>().params;
  const doc = docSelectors.selectByDocId<IFreeShipmentDocument>(id);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;

  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || [], [doc?.lines]);

  const lineSum = lines?.reduce(
    (sum, line) => {
      return {
        ...sum,
        quantPack: sum.quantPack + (line.quantPack || 0),
        weight: sum.weight + (line.weight || 0),
      };
    },
    { quantPack: 0, weight: 0 },
  );

  const isCattle = useMemo(() => (lines?.length > 0 ? lines?.[0].good.isCattle : undefined), [lines]);

  const isBlocked = doc?.status !== 'DRAFT';
  const goods = refSelectors.selectByName<IGood>('good').data;

  const settings = useSelector((state) => state.settings?.data);
  const loading = useSelector((state) => state.app.loading);
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
    return doc?.head?.fromDepart?.id && isFocused && remains
      ? getRemGoodListByContact(goods, remains[doc.head.fromDepart.id], docList, doc.head.fromDepart.id)
      : [];
  }, [doc?.head?.fromDepart?.id, goods, remains, docList, isFocused]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');

  const handleFocus = () => {
    ref?.current?.focus();
  };

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
    Keyboard.dismiss();
    handleFocus();
  };

  const handleAddQuantPack = useCallback(
    (quantity: number) => {
      const line = lines?.[0];
      if (!line) {
        return;
      }

      const lineBarcode: IBarcode = {
        barcode: line.barcode || '',
        numReceived: line.numReceived,
        quantPack: line.quantPack,
        shcode: line.good.shcode,
        weight: line.weight,
        workDate: line.workDate,
        time: line.time,
      };

      if (line?.weight >= goodBarcodeSettings?.boxWeight) {
        const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: quantity });
        const newLine: IFreeShipmentLine = {
          ...line,
          quantPack: quantity,
          scannedBarcode: line?.barcode,
          barcode: newBarcode,
        };
        dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
      } else {
        const weight = round(line?.weight * quantity, 3);

        if (remainsUse && goodRemains.length) {
          const good = goodRemains.find((item) => `0000${item.good.shcode}`.slice(-4) === line.good.shcode);

          if (good) {
            if (good.remains < weight - line.weight) {
              alertWithSound('Внимание!', 'Вес товара превышает вес в остатках.');

              return;
            } else if (weight < 1000) {
              const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: quantity, weight });

              const newLine: IFreeShipmentLine = {
                ...line,
                quantPack: quantity,
                weight,
                scannedBarcode: line?.barcode,
                barcode: newBarcode,
              };

              dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
            } else {
              const maxQuantPack = round(Math.floor(999.99 / line?.weight), 3);

              let newQuantity = quantity;
              let sortOrder = line.sortOrder || lines.length;

              while (newQuantity > 0) {
                const q = newQuantity > maxQuantPack ? maxQuantPack : newQuantity;
                const newWeight = round(line?.weight * q, 3);

                const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: q, weight: newWeight });

                const newLine: IFreeShipmentLine = {
                  ...line,
                  quantPack: q,
                  weight: newWeight,
                  scannedBarcode: line?.barcode,
                  barcode: newBarcode,
                };

                if (newQuantity === quantity) {
                  dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
                } else {
                  sortOrder = sortOrder + 1;

                  const addedLine = { ...newLine, id: generateId(), sortOrder };
                  dispatch(
                    documentActions.addDocumentLine({
                      docId: id,
                      line: addedLine,
                    }),
                  );
                }
                newQuantity = newQuantity - maxQuantPack;
              }
            }
          } else {
            alertWithSound('Ошибка!', 'Товар не найден.');

            return;
          }
        } else {
          if (weight < 1000) {
            const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: quantity, weight });

            const newLine: IFreeShipmentLine = {
              ...line,
              quantPack: quantity,
              weight,
              scannedBarcode: line?.barcode,
              barcode: newBarcode,
            };

            dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
          } else {
            const maxQuantPack = round(Math.floor(999.99 / line?.weight), 3);

            let newQuantity = quantity;
            let sortOrder = line.sortOrder || lines.length;

            while (newQuantity > 0) {
              const q = newQuantity > maxQuantPack ? maxQuantPack : newQuantity;
              const newWeight = round(line?.weight * q, 3);

              const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: q, weight: newWeight });

              const newLine: IFreeShipmentLine = {
                ...line,
                quantPack: q,
                weight: newWeight,
                scannedBarcode: line?.barcode,
                barcode: newBarcode,
              };

              if (newQuantity === quantity) {
                dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
              } else {
                sortOrder = sortOrder + 1;

                const addedLine = { ...newLine, id: generateId(), sortOrder };
                dispatch(
                  documentActions.addDocumentLine({
                    docId: id,
                    line: addedLine,
                  }),
                );
              }
              newQuantity = newQuantity - maxQuantPack;
            }
          }
        }
      }
    },
    [dispatch, goodBarcodeSettings?.boxWeight, goodRemains, id, lines, remainsUse],
  );

  const handleEditQuantPack = () => {
    handleAddQuantPack(Number(quantPack));
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    Keyboard.dismiss();
    handleFocus();
  };

  const handleDismissQuantPack = () => {
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    Keyboard.dismiss();
    handleFocus();
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('FreeShipmentEdit', { id, isCurr });
  }, [navigation, id, isCurr]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    alertWithSoundMulti('Вы уверены, что хотите удалить документ?', '', async () => {
      setScreenState('deleting');
      await sleep(1);
      const res = await docDispatch(documentActions.removeDocument(id));
      if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
        setScreenState('deleted');
      } else {
        setScreenState('idle');
      }
    });
    handleFocus();
  }, [docDispatch, id]);

  const hanldeCancelLastScan = useCallback(() => {
    if (lines?.length) {
      if (lines[0].scannedBarcode) {
        const lineIds = lines
          .filter((i) => i.scannedBarcode === lines[0].scannedBarcode)
          .map((i) => {
            return i.id;
          });
        dispatch(documentActions.removeDocumentLines({ docId: id, lineIds }));
      } else {
        dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lines[0].id }));
      }
    }
    handleFocus();
  }, [dispatch, id, lines]);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

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

  const handleSaveDocument = useCallback(() => {
    if (!doc) {
      return;
    }
    dispatch(
      documentActions.updateDocument({
        docId: id,
        document: { ...doc, status: 'READY' },
      }),
    );
    navigation.goBack();
  }, [doc, dispatch, id, navigation]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        doc?.status === 'READY' ? (
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
        ) : (
          doc?.status === 'DRAFT' && <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
        )
      ) : (
        <View style={styles.buttons}>
          {doc?.status === 'DRAFT' && <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />}
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
          <ScanButton
            onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('ScanGood', { docId: id }))}
            disabled={screenState !== 'idle'}
          />
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ),
    [actionsMenu, doc?.status, handleSaveDocument, id, isBlocked, isScanerReader, loading, navigation, screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = useCallback(
    ({ item }: { item: IFreeShipmentLine }) => {
      return (
        <ListItemLine
          key={item.id}
          readonly={doc?.status !== 'DRAFT' || item.sortOrder !== lines?.length || Boolean(item.scannedBarcode)}
          onPress={() => setVisibleQuantPackDialog(true)}
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
          </View>
        </ListItemLine>
      );
    },
    [doc?.status, lines?.length],
  );

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      alertWithSound('Внимание!', `${text}.`);
      setScanned(false);
    }
    handleFocus();
  }, []);

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

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

      const isGoodCattle = lineGood.good.isCattle;

      if (isCattle === 1 && !isGoodCattle) {
        handleErrorMessage(visibleDialog, 'Товар не относится к группе КРС!');

        return;
      } else if (isCattle === 0 && isGoodCattle) {
        handleErrorMessage(visibleDialog, 'Товар относится к группе КРС!');

        return;
      }

      if (!lineGood.isRightWeight) {
        handleErrorMessage(visibleDialog, 'Вес товара превышает вес в остатках!');
        return;
      }

      const line = doc?.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        handleErrorMessage(visibleDialog, 'Данный штрих-код уже добавлен!');
        return;
      }

      const newLine: IFreeShipmentLine = {
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        time: barc.time,
        sortOrder: doc?.lines?.length + 1,
        quantPack: barc.quantPack,
      };

      dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));

      setScanned(false);
      handleFocus();
    },

    [
      doc,
      minBarcodeLength,
      goodBarcodeSettings,
      goods,
      goodRemains,
      remainsUse,
      isCattle,
      dispatch,
      id,
      handleErrorMessage,
      visibleDialog,
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
        <View style={styles.infoBlock}>
          <MediumText>{doc.head.fromDepart?.name || ''}</MediumText>
          <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
        </View>
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
      {lines?.length ? <ViewTotal quantPack={lineSum?.quantPack || 0} weight={lineSum?.weight || 0} /> : null}
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
      <AppDialog
        title="Количество"
        visible={visibleQuantPackDialog}
        text={quantPack}
        onChangeText={setQuantPack}
        onCancel={handleDismissQuantPack}
        onOk={handleEditQuantPack}
        okLabel={'Ок'}
        keyboardType="numbers-and-punctuation"
        // errorMessage={errorMessage}
      />
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Сформировано полностью?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
    </View>
  );
};
