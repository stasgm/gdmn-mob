import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableHighlight, TextInput, Keyboard, StyleProp, ViewStyle } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Audio } from 'expo-av';

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

import {
  sleep,
  generateId,
  getDateString,
  round,
  useSendDocs,
  useSendOneRefRequest,
  isNumeric,
} from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FlashList } from '@shopify/flash-list';

import { DashboardStackParamList } from '@lib/mobile-navigation';

import { barcodeSettings, IShipmentDocument, IShipmentLine, ITempLine } from '../../store/types';

import { ShipmentStackParamList } from '../../navigation/Root/types';

import { getStatusColor, shipmentLineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';

import { IBarcode, IGood, IRemains, IRemGood } from '../../store/app/types';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../../store/index';

import {
  alertWithSound,
  alertWithSoundMulti,
  getBarcode,
  getDocToSend,
  getLineGood,
  getRemGoodListByContact,
  getUpdatedLine,
} from '../../utils/helpers';
import ViewTotal from '../../components/ViewTotal';
import QuantDialog from '../../components/QuantDialog';

const keyExtractor = (item: IShipmentLine | ITempLine) => item.id;
const ShipmentViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const isFocused = useIsFocused();

  const navigation =
    useNavigation<StackNavigationProp<ShipmentStackParamList & DashboardStackParamList, 'ShipmentView'>>();

  const { id, isCurr } = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentView'>>().params;

  const navState = navigation.getState();
  const isDashboard = navState.routes.some((route) => route.name === 'Dashboard');

  const dispatch = useDispatch();
  const fpDispatch = useFpDispatch();
  const settings = useSelector((state) => state.settings?.data);
  const isScanerReader = useSelector((state) => state.settings?.data)?.scannerUse?.data;
  const loading = useSelector((state) => state.app.loading);

  const [lineType, setLineType] = useState(shipmentLineTypes[2].id);

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(id);
  const shipmentLines = useMemo(
    () => shipment?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || [],
    [shipment?.lines],
  );

  const tempOrder = useFpSelector((state) => state.fpMovement.list).find((i) => i.orderId === shipment?.head?.orderId);
  const tempOrderLines = tempOrder?.lines?.filter((i) => i.weight > 0) as ITempLine[];

  const isBlocked = shipment?.status !== 'DRAFT';

  const isCattle = useMemo(
    () => (shipmentLines?.length > 0 ? shipmentLines?.[0].good.isCattle : undefined),
    [shipmentLines],
  );

  const shipmentLineSum = shipmentLines?.reduce(
    (sum, line) => {
      return { ...sum, quantPack: sum.quantPack + (line.quantPack || 0), weight: sum.weight + (line.weight || 0) };
    },
    { quantPack: 0, weight: 0 },
  );

  const tempLineSum = tempOrderLines?.reduce(
    (sum, line) => {
      return { ...sum, weight: sum.weight + (line.weight || 0) };
    },
    { quantPack: 0, weight: 0 },
  );

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');
  const [quantPallet, setQuantPallet] = useState('');
  const [isPack, setIsPack] = useState(true);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;
  const maxBarcodeLength = (settings.maxBarcodeLength?.data as number) || 0;

  const docList = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return shipment?.head?.fromDepart?.id && isFocused && remains
      ? getRemGoodListByContact(goods, remains[shipment.head.fromDepart.id], docList, shipment.head.fromDepart.id)
      : [];
  }, [docList, goods, remains, shipment?.head?.fromDepart?.id, isFocused]);

  const sound = Audio.Sound.createAsync(require('../../../assets/ok.wav'));

  const playSound = useCallback(async () => {
    (await sound).sound.playAsync();
  }, [sound]);

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleFocus = () => {
    ref?.current?.focus();
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
    Keyboard.dismiss();
    handleFocus();
  };

  const handleAddQuantPack = useCallback(
    (quantity: number, pallet: number) => {
      const line = shipmentLines?.[0];
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

      const weight =
        line?.weight >= goodBarcodeSettings?.boxWeight
          ? round(line?.weight * pallet, 3)
          : round(line?.weight * quantity, 3);

      const tempLine = tempOrder?.lines?.find((i) => line.good.id === i.good.id);

      const good =
        remainsUse && goodRemains.length
          ? goodRemains.find((item) => `0000${item.good.shcode}`.slice(-4) === `0000${line.good.shcode}`.slice(-4))
          : undefined;

      if (remainsUse && goodRemains.length) {
        if (!good) {
          alertWithSound('Ошибка!', 'Товар не найден.', handleFocus);

          return;
        } else if (good.remains < weight - line.weight) {
          alertWithSound('Внимание!', 'Вес товара превышает вес в остатках.', handleFocus);

          return;
        }
      }

      if (tempLine && tempOrder) {
        const newTempLine = { ...tempLine, weight: round(tempLine?.weight + line.weight - weight, 3) };
        if (newTempLine.weight >= 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          const newLine: IShipmentLine = getUpdatedLine(
            remainsUse,
            lineBarcode,
            line,
            line?.weight >= goodBarcodeSettings?.boxWeight ? round(quantity * pallet, 3) : quantity,
            weight,
          );

          dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
        } else {
          alertWithSoundMulti(
            'Данное количество превышает количество в заявке.',
            'Добавить позицию?',
            () => {
              fpDispatch(
                fpMovementActions.updateTempOrderLine({
                  docId: tempOrder?.id,
                  line: newTempLine,
                }),
              );
              const newLine: IShipmentLine = getUpdatedLine(
                remainsUse,
                lineBarcode,
                line,
                line?.weight >= goodBarcodeSettings?.boxWeight ? round(quantity * pallet, 3) : quantity,
                weight,
              );

              dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
            },
            handleFocus,
          );
        }
      } else {
        const newLine: IShipmentLine = getUpdatedLine(
          remainsUse,
          lineBarcode,
          line,
          line?.weight >= goodBarcodeSettings?.boxWeight ? round(quantity * pallet, 3) : quantity,
          weight,
        );

        dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
      }
    },
    [dispatch, fpDispatch, goodBarcodeSettings?.boxWeight, goodRemains, id, remainsUse, shipmentLines, tempOrder],
  );

  const handleEditQuantPack = useCallback(() => {
    if (!isNumeric(quantPack) || !isNumeric(quantPallet)) {
      alertWithSound('Ошибка!', 'Неправильное количество.', handleFocus);
      return;
    }

    handleAddQuantPack(Number(quantPack), Number(quantPallet));
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    setQuantPallet('');
    Keyboard.dismiss();
    handleFocus();
  }, [handleAddQuantPack, quantPack, quantPallet]);

  const handleDismissQuantPack = () => {
    setVisibleQuantPackDialog(false);
    setQuantPack('');
    setQuantPallet('');
    Keyboard.dismiss();
    handleFocus();
  };

  const handleEditShipmentHead = useCallback(
    () => navigation.navigate('ShipmentEdit', { id, isCurr }),
    [id, isCurr, navigation],
  );

  const handleCopyDoc = useCallback(async () => {
    if (!shipment) {
      return;
    }
    setScreenState('copying');
    await sleep(1);
    const newId = generateId();

    const newDocDate = new Date().toISOString();

    const newDoc: IShipmentDocument = {
      ...shipment,
      id: newId,
      status: 'DRAFT',
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    docDispatch(documentActions.addDocument(newDoc));
    navigation.navigate('ShipmentView', { id: newId, isCurr });

    setScreenState('copied');
  }, [shipment, docDispatch, navigation, isCurr]);

  const handleDeleteShipment = useCallback(async () => {
    if (!id) {
      return;
    }

    alertWithSoundMulti(
      'Вы уверены, что хотите удалить документ?',
      '',
      async () => {
        setScreenState('deleting');
        await sleep(1);
        const res = await docDispatch(documentActions.removeDocument(id));
        if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
          setScreenState('deleted');
        } else {
          setScreenState('idle');
        }
      },
      handleFocus,
    );
  }, [docDispatch, id]);

  const hanldeCancelLastScan = useCallback(() => {
    if (shipmentLines?.length) {
      const shipmentLine = shipmentLines?.[0];
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: shipmentLine.id }));

      const tempLine = tempOrder?.lines?.find((i) => shipmentLine.good.id === i.good.id);
      if (tempLine && tempOrder) {
        fpDispatch(
          fpMovementActions.updateTempOrderLine({
            docId: tempOrder.id,
            line: { ...tempLine, weight: round(tempLine.weight + shipmentLine.weight, 3) },
          }),
        );
      }
    }
    handleFocus();
  }, [dispatch, fpDispatch, id, shipmentLines, tempOrder]);

  const actionsMenu = useCallback(() => {
    showActionSheet(
      isBlocked
        ? shipment?.status === 'SENT'
          ? [
              {
                title: 'Копировать документ',
                onPress: handleCopyDoc,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ]
          : [
              {
                title: 'Копировать документ',
                onPress: handleCopyDoc,
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
            ]
        : [
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
              title: 'Копировать документ',
              onPress: handleCopyDoc,
            },
            {
              title: 'Удалить документ',
              type: 'destructive',
              onPress: handleDeleteShipment,
            },
            {
              title: 'Отмена',
              type: 'cancel',
              onPress: handleFocus,
            },
          ],
    );
  }, [
    showActionSheet,
    isBlocked,
    shipment?.status,
    handleCopyDoc,
    handleDeleteShipment,
    hanldeCancelLastScan,
    handleEditShipmentHead,
  ]);

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

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);
  const [visibleRequestDialog, setVisibleRequestDialog] = useState(false);

  const sendDoc = useSendDocs(shipment ? [shipment] : [], shipment ? [getDocToSend(shipment)] : []);

  const sendRemainsRequest = useSendOneRefRequest('Остатки', { name: 'remains' });

  const handleSendRemainsRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRemainsRequest();
  }, [sendRemainsRequest]);

  const handleSendRequest = useCallback(async () => {
    setVisibleRequestDialog(false);
    await sendRemainsRequest();
  }, [sendRemainsRequest]);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();

    await handleSendRemainsRequest();
    setScreenState('sent');
  }, [handleSendRemainsRequest, sendDoc]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        shipment?.status === 'READY' ? (
          <View style={styles.buttons}>
            <SendButton
              onPress={() => setVisibleSendDialog(true)}
              disabled={screenState !== 'idle' || loading || !shipmentLines?.length}
            />
            <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
          </View>
        ) : (
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        )
      ) : (
        <View style={styles.buttons}>
          {shipment?.status === 'DRAFT' && (
            <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
          )}
          <SendButton
            onPress={() => setVisibleSendDialog(true)}
            disabled={screenState !== 'idle' || loading || !shipmentLines?.length}
          />

          <ScanButton
            onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('ScanGood', { docId: id, isCurr }))}
            disabled={screenState !== 'idle'}
          />
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ),
    [
      isBlocked,
      shipment?.status,
      screenState,
      loading,
      shipmentLines?.length,
      handleSaveDocument,
      actionsMenu,
      isScanerReader,
      navigation,
      id,
      isCurr,
    ],
  );

  const renderLeft = useCallback(
    () => (
      <BackButton
        onPress={() =>
          isDashboard ? navigation.goBack() : navigation.navigate(isCurr ? 'CurrShipmentList' : 'ShipmentList')
        }
      />
    ),
    [isCurr, isDashboard, navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderLeft,
      headerRight: renderRight,
    });
  }, [navigation, renderLeft, renderRight]);

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      alertWithSound('Внимание!', `${text}.`, handleFocus);
      setScanned(false);
    }
  }, []);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!shipment) {
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

      if (brc.length > maxBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода больше максимальной длины, указанной в настройках. Повторите сканирование!',
        );
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);
      const lineGood = getLineGood(barc.shcode, barc.weight, goods, goodRemains, remainsUse);

      if (!lineGood.good) {
        setVisibleRequestDialog(true);
        setScanned(false);
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

      const line = shipmentLines?.find((i) => i.barcode === barc.barcode || i.scannedBarcode === barc.barcode);

      if (line) {
        handleErrorMessage(visibleDialog, 'Данный штрих-код уже добавлен!');
        return;
      }

      const tempLine = tempOrder?.lines?.find((i) => lineGood.good?.id === i.good.id);

      const newLine: IShipmentLine = {
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        time: barc.time,
        quantPack: barc.quantPack,
        sortOrder: (shipmentLines?.length || 0) + 1,
        usedRemains: remainsUse,
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
          playSound();
        } else if (newTempLine.weight === 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
          playSound();
        } else {
          alertWithSoundMulti(
            'Данное количество превышает количество в заявке.',
            'Добавить позицию?',
            () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
              fpDispatch(
                fpMovementActions.updateTempOrderLine({
                  docId: tempOrder?.id,
                  line: newTempLine,
                }),
              );
              playSound();
            },
            handleFocus,
          );
        }
      } else {
        alertWithSoundMulti(
          'Данный товар отсутствует в позициях заявки.',
          'Добавить позицию?',
          () => {
            dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
            playSound();
          },
          handleFocus,
        );
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
      shipment,
      minBarcodeLength,
      maxBarcodeLength,
      goodBarcodeSettings,
      goods,
      goodRemains,
      remainsUse,
      isCattle,
      shipmentLines,
      tempOrder,
      visibleDialog,
      handleErrorMessage,
      fpDispatch,
      dispatch,
      id,
      playSound,
    ],
  );

  const handleSearchBarcode = () => {
    getScannedObject(barcode);
  };

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
    if (screenState === 'sent' || screenState === 'deleted' || screenState === 'copied') {
      setScreenState('idle');
      if (screenState !== 'copied') {
        navigation.goBack();
      }
    }
  }, [navigation, screenState]);

  const LineTypes = useCallback(
    () => (
      <View style={styles.containerCenter}>
        {shipmentLineTypes.map((e, i) => {
          return (
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor="#DDDDDD"
              key={e.id}
              style={[
                styles.btnTab,
                i === 0 && styles.firstBtnTab,
                i === shipmentLineTypes.length - 1 && styles.lastBtnTab,
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

  const handlePressLine = useCallback(
    (weight: number) => {
      setQuantPack('');
      setQuantPallet('1');
      setVisibleQuantPackDialog(true);
      weight >= goodBarcodeSettings?.boxWeight ? setIsPack(false) : setIsPack(true);
    },
    [goodBarcodeSettings?.boxWeight],
  );

  const renderShipmentItem = useCallback(
    ({ item }: { item: IShipmentLine }) => {
      return (
        <ListItemLine
          // key={item.id}
          readonly={
            shipment?.status !== 'DRAFT' || item?.sortOrder !== shipmentLines?.length || Boolean(item.scannedBarcode)
          }
          onPress={() => handlePressLine(item.weight)}
        >
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{item.good.name}</LargeText>
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} />
              <MediumText>
                {(item.weight || 0).toString()} кг, {(item.quantPack || 0).toString()} кор.
              </MediumText>
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
    [handlePressLine, shipment?.status, shipmentLines?.length],
  );

  const renderTempItem = useCallback(({ item }: { item: ITempLine }) => {
    return (
      <ListItemLine key={item.id} readonly={true}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <View style={styles.directionRow}>
            <MediumText>Вес: {(item.weight || 0).toString()} кг</MediumText>
          </View>
        </View>
      </ListItemLine>
    );
  }, []);

  const LastLine = useMemo(() => renderShipmentItem, [renderShipmentItem]);

  const viewStyle: StyleProp<ViewStyle> = useMemo(
    () => ({ ...styles.container, justifyContent: lineType === 'last' ? 'flex-start' : 'center' }),
    [lineType],
  );

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting' || screenState === 'copying' || screenState === 'sending') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>
            {screenState === 'deleting'
              ? 'Удаление документа...'
              : screenState === 'copying'
                ? 'Копирование документа...'
                : 'Отправка документа...'}
          </LargeText>
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
    <View style={viewStyle}>
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
          {shipment.sentDate ? (
            <View style={styles.rowCenter}>
              <MediumText>
                Отправлено: {getDateString(shipment.sentDate)} {new Date(shipment.sentDate).toLocaleTimeString()}
              </MediumText>
            </View>
          ) : null}
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
          <FlashList
            key={lineType}
            data={shipmentLines}
            renderItem={renderShipmentItem}
            estimatedItemSize={60}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={keyExtractor}
            extraData={[shipmentLines, isBlocked]}
            keyboardShouldPersistTaps={'always'}
          />
          <ViewTotal quantPack={shipmentLineSum?.quantPack} weight={shipmentLineSum?.weight || 0} />
        </>
      ) : lineType === 'order' ? (
        <>
          <FlashList
            key={lineType}
            data={tempOrderLines}
            renderItem={renderTempItem}
            estimatedItemSize={60}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={keyExtractor}
            extraData={[tempOrderLines, isBlocked]}
            keyboardShouldPersistTaps={'always'}
          />
          <ViewTotal weight={tempLineSum?.weight || 0} />
        </>
      ) : lineType === 'last' && shipmentLines?.[0] ? (
        <View style={styles.spaceBetween}>
          <LastLine item={shipmentLines?.[0]} />
          <ViewTotal quantPack={shipmentLineSum?.quantPack} weight={shipmentLineSum?.weight || 0} />
        </View>
      ) : null}
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
      <QuantDialog
        visible={visibleQuantPackDialog}
        textPack={quantPack}
        textPallet={quantPallet}
        onChangeTextPack={setQuantPack}
        onChangeTextPallet={setQuantPallet}
        onCancel={handleDismissQuantPack}
        onOk={handleEditQuantPack}
        okLabel={'Ок'}
        isPack={isPack}
        keyboardType="numbers-and-punctuation"
        okDisabled={!quantPack || !quantPallet}
      />
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Сформировано полностью?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
      <SimpleDialog
        visible={visibleRequestDialog}
        title={'Внимание!'}
        text={'Товар не найден. Отправить запрос за остатками?'}
        onCancel={() => setVisibleRequestDialog(false)}
        onOk={handleSendRequest}
        okDisabled={loading}
      />
    </View>
  );
};

export default ShipmentViewScreen;
