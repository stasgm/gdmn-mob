import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, View, FlatList, TouchableHighlight, TextInput, ListRenderItem } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  AppActivityIndicator,
  MediumText,
  LargeText,
  BackButton,
  ListItemLine,
  AppDialog,
  SendButton,
  ScanButton,
  SaveDocument,
  SimpleDialog,
} from '@lib/mobile-ui';

import { sleep, generateId, getDateString, round, useSendDocs } from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { barcodeSettings, IShipmentDocument, IShipmentLine, ITempLine } from '../../store/types';

import { ShipmentStackParamList } from '../../navigation/Root/types';

import { getStatusColor, lineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';

import { IGood } from '../../store/app/types';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../../store/index';

import { getBarcode } from '../../utils/helpers';
import ViewTotal from '../../components/ViewTotal';

const keyExtractor = (item: IShipmentLine | ITempLine) => item.id;

const ShipmentViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentView'>>();
  const id = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentView'>>().params?.id;
  const dispatch = useDispatch();
  const fpDispatch = useFpDispatch();
  const settings = useSelector((state) => state.settings?.data);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;
  const loading = useSelector((state) => state.app.loading);

  const [lineType, setLineType] = useState(lineTypes[1].id);

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(id);
  const shipmentLines = useMemo(
    () => shipment?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)),
    [shipment?.lines],
  );

  const tempOrder = useFpSelector((state) => state.fpMovement.list).find((i) => i.orderId === shipment?.head?.orderId);
  const tempOrderLines = tempOrder?.lines?.filter((i) => i.weight > 0) as ITempLine[];

  const isBlocked = shipment?.status !== 'DRAFT';

  const shipmentLineSum = shipmentLines?.reduce((sum, line) => sum + line.weight, 0) || 0;
  const tempLineSum = tempOrderLines?.reduce((sum, line) => sum + line.weight, 0) || 0;

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');

  const goods = refSelectors.selectByName<IGood>('good').data;

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;

  const handleGetBarcode = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        setErrorMessage('Штрих-код неверного формата');
        return;
      }

      if (brc.length < minBarcodeLength) {
        setErrorMessage('Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!');
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      if (!good) {
        setErrorMessage('Товар не найден');
        return;
      }

      const line = shipment?.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        setErrorMessage('Товар уже добавлен');
        return;
      }

      const tempLine = tempOrder?.lines?.find((i) => good.id === i.good.id);

      const barcodeItem = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: (shipmentLines?.length || 0) + 1,
      };

      if (tempLine && tempOrder) {
        const newTempLine = { ...tempLine, weight: round(tempLine.weight - barcodeItem.weight, 3) };

        setErrorMessage('');
        if (newTempLine.weight > 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: barcodeItem }));
        } else if (newTempLine.weight === 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: barcodeItem }));
        } else {
          Alert.alert('Данное количество превышает количество в заявке.', 'Добавить позицию?', [
            {
              text: 'Да',
              onPress: () => {
                dispatch(documentActions.addDocumentLine({ docId: id, line: barcodeItem }));
                fpDispatch(
                  fpMovementActions.updateTempOrderLine({
                    docId: tempOrder?.id,
                    line: newTempLine,
                  }),
                );
              },
            },
            {
              text: 'Отмена',
            },
          ]);
        }
      } else {
        Alert.alert('Данный товар отсутствует в позициях заявки!', 'Добавить позицию?', [
          {
            text: 'Да',
            onPress: async () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: barcodeItem }));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
      setVisibleDialog(false);
      setBarcode('');
    },

    [dispatch, fpDispatch, goodBarcodeSettings, goods, id, minBarcodeLength, shipment?.lines, shipmentLines, tempOrder],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
  };

  const handleAddQuantPack = (quantity: string) => {
    console.log('quantPack', quantity);
  };

  const handleEditQuantPack = () => {
    handleAddQuantPack(quantPack);
  };

  const handleDismissQuantPack = () => {
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    // setErrorMessage('');
  };

  const handleEditShipmentHead = useCallback(() => navigation.navigate('ShipmentEdit', { id }), [navigation, id]);

  const handleDeleteShipment = useCallback(async () => {
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
            if (tempOrder) {
              fpDispatch(fpMovementActions.removeTempOrder(tempOrder?.id));
            }
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
  }, [docDispatch, fpDispatch, id, tempOrder]);

  const hanldeCancelLastScan = useCallback(() => {
    if (shipmentLines?.length) {
      const ShipmentLine = shipmentLines?.[0];
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: ShipmentLine.id }));

      const tempLine = tempOrder?.lines?.find((i) => ShipmentLine.good.id === i.good.id);
      if (tempLine && tempOrder) {
        fpDispatch(
          fpMovementActions.updateTempOrderLine({
            docId: tempOrder.id,
            line: { ...tempLine, weight: round(tempLine.weight + ShipmentLine.weight, 3) },
          }),
        );
      }
    }
  }, [dispatch, fpDispatch, id, shipmentLines, tempOrder]);

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
        onPress: handleEditShipmentHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDeleteShipment,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditShipmentHead, handleDeleteShipment]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const handleSaveDocument = useCallback(() => {
    if (!shipment) {
      return;
    }
    dispatch(
      documentActions.updateDocument({
        docId: id,
        document: { ...shipment, status: 'READY' },
      }),
    );
    navigation.goBack();
  }, [dispatch, id, navigation, shipment]);

  const sendDoc = useSendDocs(shipment ? [shipment] : []);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    setScreenState('sent');
  }, [sendDoc]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        shipment?.status === 'READY' ? (
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
        ) : (
          shipment?.status === 'DRAFT' && (
            <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
          )
        )
      ) : (
        <View style={styles.buttons}>
          {shipment?.status === 'DRAFT' && (
            <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
          )}
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
    [
      actionsMenu,
      handleSaveDocument,
      id,
      isBlocked,
      isScanerReader,
      loading,
      navigation,
      screenState,
      shipment?.status,
    ],
  );

  const renderLeft = useCallback(
    () => <BackButton onPress={() => navigation.navigate('ShipmentList')} />,
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderLeft,
      headerRight: renderRight,
    });
  }, [navigation, renderLeft, renderRight]);

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        Alert.alert('Внимание!', 'Штрих-код не определен. Повторите сканирование!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      if (brc.length < minBarcodeLength) {
        Alert.alert(
          'Внимание!',
          'Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!',
          [{ text: 'OK' }],
        );
        setScanned(false);
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      if (!good) {
        Alert.alert('Внимание!', 'Товар не найден!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const line = shipmentLines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const tempLine = tempOrder?.lines?.find((i) => good.id === i.good.id);

      const newLine: IShipmentLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: (shipmentLines?.length || 0) + 1,
      };

      if (tempLine && tempOrder) {
        const newTempLine = { ...tempLine, weight: round(tempLine.weight - newLine.weight, 3) };
        if (newTempLine.weight > 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
        } else if (newTempLine.weight === 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
        } else {
          Alert.alert('Данное количество превышает количество в заявке.', 'Добавить позицию?', [
            {
              text: 'Да',
              onPress: () => {
                dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
                fpDispatch(
                  fpMovementActions.updateTempOrderLine({
                    docId: tempOrder?.id,
                    line: newTempLine,
                  }),
                );
              },
            },
            {
              text: 'Отмена',
            },
          ]);
        }
      } else {
        Alert.alert('Данный товар отсутствует в позициях заявки.', 'Добавить позицию?', [
          {
            text: 'Да',
            onPress: () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }

      setScanned(false);
    },

    [minBarcodeLength, goodBarcodeSettings, goods, shipmentLines, tempOrder, fpDispatch, dispatch, id],
  );

  //Для отрисовки при каждом новом сканировании
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

  const LineTypes = useCallback(
    () => (
      <View style={styles.containerCenter}>
        {lineTypes.map((e, i) => {
          return (
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor="#DDDDDD"
              key={e.id}
              style={[
                styles.btnTab,
                i === 0 && styles.firstBtnTab,
                i === lineTypes.length - 1 && styles.lastBtnTab,
                e.id === lineType && { backgroundColor: colors.primary },
                { borderColor: colors.primary },
              ]}
              onPress={() => setLineType(e.id)}
            >
              <LargeText style={{ color: e.id === lineType ? colors.background : colors.text }}>{e.value}</LargeText>
            </TouchableHighlight>
          );
        })}
      </View>
    ),
    [colors.background, colors.primary, colors.text, lineType],
  );

  const renderShipmentItem: ListRenderItem<IShipmentLine> = ({ item }) => (
    <ListItemLine key={item.id} readonly={item.sortOrder !== shipmentLines?.length}>
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

  const renderTempItem: ListRenderItem<ITempLine> = ({ item }) => (
    <ListItemLine key={item.id} readonly={true}>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.good.name}</LargeText>
        <View style={styles.directionRow}>
          <MediumText>Вес: {(item.weight || 0).toString()} кг</MediumText>
        </View>
      </View>
    </ListItemLine>
  );

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

  if (!shipment) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(shipment?.status || 'DRAFT')}
        title={shipment.documentType.description || ''}
        onPress={handleEditShipmentHead}
        disabled={!['DRAFT', 'READY'].includes(shipment.status)}
        isBlocked={isBlocked}
      >
        <View style={styles.infoBlock}>
          <MediumText>{shipment.head.outlet?.name || ''}</MediumText>
          <MediumText>{`№ ${shipment.number} на ${getDateString(shipment.head?.onDate)}`}</MediumText>
        </View>
      </InfoBlock>
      <LineTypes />
      <TextInput
        style={styles.scanInput}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      {lineType === 'shipment' ? (
        <>
          <FlatList
            key={lineType}
            data={shipmentLines}
            keyExtractor={keyExtractor}
            renderItem={renderShipmentItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />
          <ViewTotal quantity={shipmentLineSum} weight={shipmentLines?.length || 0} />
        </>
      ) : (
        <>
          <FlatList
            key={lineType}
            data={tempOrderLines}
            keyExtractor={keyExtractor}
            renderItem={renderTempItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />
          <ViewTotal quantity={tempLineSum} weight={tempOrderLines?.length || 0} />
        </>
      )}
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

export default ShipmentViewScreen;
