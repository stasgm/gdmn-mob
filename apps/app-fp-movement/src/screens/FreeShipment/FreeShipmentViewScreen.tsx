import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Alert, TextInput, ListRenderItem } from 'react-native';
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

import { generateId, getDateString, keyExtractor, useSendDocs, sleep } from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { barcodeSettings, IFreeShipmentDocument, IFreeShipmentLine, IShipmentDocument } from '../../store/types';
import { FreeShipmentStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import { getBarcode, getLineGood, getNewDate, getRemGoodListByContact, getTotalWeight } from '../../utils/helpers';
import { IGood, IRemains, IRemGood } from '../../store/app/types';

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

  const id = useRoute<RouteProp<FreeShipmentStackParamList, 'FreeShipmentView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IFreeShipmentDocument>(id);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;

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
  const loading = useSelector((state) => state.app.loading);
  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;

  const docList = useSelector((state) => state.documents.list);

  const docsSubtraction = useMemo(
    () =>
      docList?.filter(
        (i) =>
          i.documentType?.name !== 'order' &&
          i.documentType?.name !== 'inventory' &&
          i.documentType?.name !== 'return' &&
          i.status !== 'PROCESSED' &&
          (i?.head?.depart?.id === doc?.head.depart?.id || i?.head?.fromDepart?.id === doc?.head.depart?.id),
      ) as IShipmentDocument[],
    [doc?.head.depart?.id, docList],
  );

  const docsAddition = useMemo(
    () =>
      docList?.filter(
        (i) =>
          i.documentType?.name !== 'order' &&
          i.documentType?.name !== 'inventory' &&
          i.documentType?.name !== 'return' &&
          i.status !== 'PROCESSED' &&
          i?.head?.toDepart?.id === doc?.head.depart?.id,
      ) as IShipmentDocument[],
    [doc?.head.depart?.id, docList],
  );

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return doc?.head.depart.id ? getRemGoodListByContact(goods, remains[doc?.head.depart.id]) : [];
  }, [doc?.head.depart.id, goods, remains]);

  // console.log('goodRemains', jsonFormat(goodRemains));

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
  };

  const handleAddQuantPack = useCallback(
    (quantity: number) => {
      const line = lines?.[0];
      if (!line) {
        return;
      }

      const weight = line?.weight * quantity;

      if (remainsUse) {
        const good = goodRemains.find(
          (item) =>
            `0000${item.good.shcode}`.slice(-4) === line.good.shcode &&
            item.numReceived === line.numReceived &&
            new Date(getNewDate(item.workDate)).getTime() === new Date(line.workDate).getTime(),
        );

        if (good) {
          const linesSubtractionWeight = getTotalWeight(good, docsSubtraction);
          const linesAdditiontionWeight = getTotalWeight(good, docsAddition);

          if (good.remains + linesAdditiontionWeight < linesSubtractionWeight + weight - line.weight) {
            Alert.alert('Внимание!', 'Вес товара превышает вес в остатках!', [{ text: 'OK' }]);

            return;
          } else if (weight < 1000) {
            const newLine: IFreeShipmentLine = {
              ...line,
              quantPack: quantity,
              weight,
              scannedBarcode: line?.barcode,
            };

            dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
          } else {
            const maxQuantPack = Math.floor(999.99 / line?.weight);

            let newQuantity = quantity;
            let sortOrder = line.sortOrder || lines.length;

            while (newQuantity > 0) {
              const q = newQuantity > maxQuantPack ? maxQuantPack : newQuantity;
              const newWeight = line?.weight * q;

              const newLine: IFreeShipmentLine = {
                ...line,
                quantPack: q,
                weight: newWeight,
                scannedBarcode: line?.barcode,
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
          Alert.alert('Ошибка!', 'Товар не найден', [{ text: 'OK' }]);
          return;
        }
      } else {
        if (weight < 1000) {
          const newLine: IFreeShipmentLine = {
            ...line,
            quantPack: quantity,
            weight,
            scannedBarcode: line?.barcode,
          };

          dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
        } else {
          const maxQuantPack = Math.floor(999.99 / line?.weight);

          let newQuantity = quantity;
          let sortOrder = line.sortOrder || lines.length;

          while (newQuantity > 0) {
            const q = newQuantity > maxQuantPack ? maxQuantPack : newQuantity;
            const newWeight = line?.weight * q;

            const newLine: IFreeShipmentLine = {
              ...line,
              quantPack: q,
              weight: newWeight,
              scannedBarcode: line?.barcode,
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
    },
    [dispatch, docsAddition, docsSubtraction, goodRemains, id, lines, remainsUse],
  );

  const handleEditQuantPack = () => {
    handleAddQuantPack(Number(quantPack));
    setVisibleQuantPackDialog(false);
    setQuantPack('');
  };

  const handleDismissQuantPack = () => {
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    // setErrorMessage('');
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('FreeShipmentEdit', { id });
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
  }, [dispatch, id, lines]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    setScreenState('sent');
  }, [sendDoc]);

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
  }, [dispatch, id, navigation, doc]);

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
          {!isScanerReader && (
            <ScanButton
              onPress={() => navigation.navigate('ScanGood', { docId: id })}
              disabled={screenState !== 'idle'}
            />
          )}
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

  const renderItem: ListRenderItem<IFreeShipmentLine> = ({ item }) => (
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

      const lineGood = getLineGood(barc, goods, goodRemains, remainsUse, docsSubtraction, docsAddition);

      if (!lineGood.good) {
        if (visibleDialog) {
          setErrorMessage('Товар не найден');
        } else {
          Alert.alert('Внимание!', 'Товар не найден!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      if (!lineGood.isRightWeight) {
        if (visibleDialog) {
          setErrorMessage('Вес товара превышает вес в остатках');
        } else {
          Alert.alert('Внимание!', 'Вес товара превышает вес в остатках!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      const line = doc?.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        if (visibleDialog) {
          setErrorMessage('Товар уже добавлен');
        } else {
          Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
          setScanned(false);
        }
        return;
      }

      const newLine: IFreeShipmentLine = {
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        sortOrder: doc?.lines?.length + 1,
        quantPack: barc.quantPack,
      };

      dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));

      setScanned(false);
    },

    [
      doc,
      minBarcodeLength,
      goodBarcodeSettings,
      remainsUse,
      visibleDialog,
      goodRemains,
      docsSubtraction,
      docsAddition,
      dispatch,
      id,
      goods,
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
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
        isBlocked={isBlocked}
      >
        <View style={styles.infoBlock}>
          <MediumText>{doc.head.depart.name || ''}</MediumText>
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
      <FlatList
        data={lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        windowSize={7}
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
        text={'Вы уверены, что хотите отправить документ?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
    </View>
  );
};
