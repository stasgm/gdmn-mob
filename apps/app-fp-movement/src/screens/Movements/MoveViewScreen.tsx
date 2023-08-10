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
  LargeText,
  AppDialog,
  ListItemLine,
  ScanButton,
  navBackButton,
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

import { barcodeSettings, IMoveDocument, IMoveLine, IShipmentDocument } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import {
  alertWithSound,
  alertWithSoundMulti,
  getBarcode,
  getBarcodeString,
  getLineGood,
  getRemGoodListByContact,
} from '../../utils/helpers';
import { IAddressStoreEntity, IBarcode, IGood, IRemains, IRemGood } from '../../store/app/types';

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
  const isFocused = useIsFocused();

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
  const lineSum = lines?.reduce(
    (sum, line) => {
      return { ...sum, quantPack: sum.quantPack + (line.quantPack || 0), weight: sum.weight + (line.weight || 0) };
    },
    { quantPack: 0, weight: 0 },
  );

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

  const isAddressStore = Boolean(settings.addressStore?.data);

  const docList = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return doc?.head?.fromDepart?.id && isFocused && remains && remains
      ? getRemGoodListByContact(goods, remains[doc.head.fromDepart.id], docList, doc.head.fromDepart.id)
      : [];
  }, [doc?.head?.fromDepart?.id, docList, goods, isFocused, remains]);

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
  };

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');

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

      const isFromAddressed = departs.find((i) => i.id === doc?.head.fromDepart?.id && i.isAddressStore);
      const isToAddressed = departs.find((i) => i.id === doc?.head.toDepart?.id && i.isAddressStore);

      if (
        (doc?.head.toDepart?.isAddressStore ||
          doc?.head.fromDepart?.isAddressStore ||
          isFromAddressed ||
          isToAddressed) &&
        line.weight >= goodBarcodeSettings?.boxWeight
      ) {
        const newLine: IMoveLine = {
          ...line,
          quantPack: quantity,
          scannedBarcode: line?.barcode,
        };
        dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
        return;
      }

      if (line?.weight >= goodBarcodeSettings?.boxWeight) {
        const newBarcode = getBarcodeString({ ...lineBarcode, quantPack: quantity });
        const newLine: IMoveLine = {
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

              const newLine: IMoveLine = {
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

                const newLine: IMoveLine = {
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

            const newLine: IMoveLine = {
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

              const newLine: IMoveLine = {
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
    [
      departs,
      dispatch,
      doc?.head.fromDepart?.id,
      doc?.head.fromDepart?.isAddressStore,
      doc?.head.toDepart?.id,
      doc?.head.toDepart?.isAddressStore,
      goodBarcodeSettings?.boxWeight,
      goodRemains,
      id,
      lines,
      remainsUse,
    ],
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
    navigation.navigate('MoveEdit', { id });
  }, [navigation, id]);

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
  }, [docDispatch, id]);

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = doc?.lines?.[0]?.id;
    if (lastId) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
    }
    handleFocus();
  }, [dispatch, doc?.lines, id]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const sendCellRequest = useSendOneRefRequest('Ячейки', { name: 'cell' });

  const handleSendCellRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendCellRequest();
  }, [sendCellRequest]);

  const sendRemainsRequest = useSendOneRefRequest('Остатки', { name: 'remains' });

  const handleSendRemainsRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRemainsRequest();
  }, [sendRemainsRequest]);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    if (isAddressStore) {
      handleSendCellRequest();
    }
    handleSendRemainsRequest();
    setScreenState('sent');
  }, [handleSendCellRequest, handleSendRemainsRequest, isAddressStore, sendDoc]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Отправить запрос на получение справочника ячеек',
        onPress: handleSendCellRequest,
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
  }, [showActionSheet, handleSendCellRequest, hanldeCancelLastScan, handleEditDocHead, handleDelete]);

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
            {doc?.head.fromDepart?.isAddressStore ? (
              <View style={styles.flexDirectionRow}>
                <MediumText>Откуда: {item.fromCell || ''}</MediumText>
              </View>
            ) : null}
            {doc?.head.toDepart?.isAddressStore ? (
              <View style={styles.flexDirectionRow}>
                <MediumText>
                  {doc?.head.fromDepart?.isAddressStore ? 'Куда:' : 'Ячейка №'} {item.toCell || ''}
                </MediumText>
              </View>
            ) : null}
          </View>
        </ListItemLine>
      );
    },
    [doc?.head.fromDepart?.isAddressStore, doc?.head.toDepart?.isAddressStore, doc?.status, lines?.length],
  );

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      alertWithSound('Внимание!', `${text}.`);
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
        handleErrorMessage(visibleDialog, 'Данный штрих-код уже добавлен!');
        return;
      }

      const newLine: IMoveLine = {
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        time: barc.time,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,

        sortOrder: doc.lines?.length + 1,
      };

      const isFromAddressed = departs.find((i) => i.id === doc.head.fromDepart?.id && i.isAddressStore);
      const isToAddressed = departs.find((i) => i.id === doc.head.toDepart?.id && i.isAddressStore);

      if (
        (doc.head.toDepart?.isAddressStore ||
          doc.head.fromDepart?.isAddressStore ||
          isFromAddressed ||
          isToAddressed) &&
        barc.weight < goodBarcodeSettings?.boxWeight
      ) {
        handleErrorMessage(visibleDialog, 'Отсканированный товар не является поддоном!');
        return;
      }

      if (
        doc.head.toDepart?.isAddressStore ||
        doc.head.fromDepart?.isAddressStore ||
        isFromAddressed ||
        isToAddressed
      ) {
        if (goodBarcodeSettings.boxWeight > newLine.weight) {
          handleErrorMessage(visibleDialog, `Вес поддона не может быть меньше ${goodBarcodeSettings.boxWeight}!`);
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
      handleFocus();
    },

    [
      doc,
      minBarcodeLength,
      goodBarcodeSettings,
      goods,
      goodRemains,
      remainsUse,
      departs,
      visibleDialog,
      handleErrorMessage,
      navigation,
      id,
      dispatch,
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
      <AppDialog
        title="Количество"
        visible={visibleQuantPackDialog}
        text={quantPack}
        onChangeText={setQuantPack}
        onCancel={handleDismissQuantPack}
        onOk={handleEditQuantPack}
        okLabel={'Ок'}
        keyboardType="numbers-and-punctuation"
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
