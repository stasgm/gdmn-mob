import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Keyboard, TouchableHighlight, StyleProp, ViewStyle } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { FlashList } from '@shopify/flash-list';

import {
  // appActions,
  docSelectors,
  documentActions,
  refSelectors,
  useDispatch,
  useDocThunkDispatch,
  useSelector,
} from '@lib/store';
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
  ScanButton,
  navBackButton,
  SaveDocument,
  SimpleDialog,
  DateInfo,
  PackageButton,
} from '@lib/mobile-ui';

import {
  generateId,
  getDateString,
  keyExtractor,
  useSendDocs,
  sleep,
  useSendOneRefRequest,
  round,
  isNumeric,
} from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { barcodeSettings, IBox, IFreeShipmentDocument, IFreeShipmentLine, IShipmentDocument } from '../../store/types';
import { FreeShipmentStackParamList } from '../../navigation/Root/types';
import { getStatusColor, lineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';

import {
  alertWithSound,
  alertWithSoundMulti,
  getBarcode,
  getCodeForCheck,
  getDocToSend,
  getLineGood,
  getNextDocNumber,
  getRemGoodListByContact,
  getUpdatedLine,
  playSound,
  TypeSound,
} from '../../utils/helpers';
import { IBarcode, IGood, IRemains, IRemGood } from '../../store/app/types';

import ViewTotal from '../../components/ViewTotal';
import QuantDialog from '../../components/QuantDialog';
import LineItem from '../../components/LineItem';
import BoxDialog from '../../components/BoxDialog';
import BarcodeDialog from '../../components/BarcodeDialog';

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

  const { colors } = useTheme();

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

  const isCattle = useMemo(() => (lines?.length > 0 ? lines?.[0].good?.isCattle : undefined), [lines]);

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
  const maxBarcodeLength = (settings.maxBarcodeLength?.data as number) || 0;

  const scanUnit = Boolean(settings.scanUnit?.data);

  const usePackage = Boolean(settings.usePackage?.data);

  const docList = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return doc?.head?.fromDepart?.id && isFocused && remains
      ? getRemGoodListByContact(goods, remains[doc.head.fromDepart.id] /*, docList, doc.head.fromDepart.id*/)
      : [];
  }, [doc?.head?.fromDepart?.id, goods, remains, isFocused]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [visibleQuantPackDialog, setVisibleQuantPackDialog] = useState(false);
  const [quantPack, setQuantPack] = useState('');
  const [quantPallet, setQuantPallet] = useState('');
  const [isPack, setIsPack] = useState(true);

  const [visibleBoxDialog, setVisibleBoxDialog] = useState<boolean>(false);
  const [box, setBox] = useState<IBox | undefined>(undefined);

  const [visibleBarcodeDialog, setVisibleBarcodeDialog] = useState<boolean>(false);
  const [brcLine, setBrcLine] = useState<IFreeShipmentLine | undefined>(undefined);

  // const sound = Audio.Sound.createAsync(require('../../../assets/ok.wav'));

  // const playSound = useCallback(async () => {
  //   (await sound).sound.playAsync();
  // }, [sound]);

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
    (quantity: number, pallet: number) => {
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

      const weight =
        line?.weight >= goodBarcodeSettings?.boxWeight
          ? round(line?.weight * pallet, 3)
          : round(line?.weight * quantity, 3);

      const good =
        remainsUse && goodRemains.length
          ? goodRemains.find(
              (item) =>
                getCodeForCheck(item.good.shcode, goodBarcodeSettings?.countCode || 4) ===
                getCodeForCheck(line.good.shcode, goodBarcodeSettings?.countCode || 4),
            )
          : undefined;

      if (remainsUse && goodRemains.length) {
        if (!good) {
          alertWithSound('Ошибка!', 'Товар не найден.', handleFocus, 'NOT_FIND_GOOD');

          return;
        } else if (good.remains < weight - line.weight) {
          alertWithSound('Внимание!', 'Вес товара превышает вес в остатках.', handleFocus, 'NOT_REMAINS_GOOD');

          return;
        }
      }

      const newLine: IFreeShipmentLine = getUpdatedLine(
        goodBarcodeSettings,
        remainsUse,
        lineBarcode,
        line,
        line?.weight >= goodBarcodeSettings?.boxWeight ? round(quantity * pallet, 3) : quantity,
        weight,
      );

      dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
    },
    [dispatch, goodBarcodeSettings, goodRemains, id, lines, remainsUse],
  );

  const handleEditQuantPack = useCallback(() => {
    if (!isNumeric(quantPack) || !isNumeric(quantPallet)) {
      alertWithSound('Ошибка!', 'Неправильное количество.', handleFocus, 'INCORRECT_QUANTITY');
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

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('FreeShipmentEdit', { id, isCurr });
  }, [navigation, id, isCurr]);

  const handleCopyDoc = useCallback(async () => {
    if (!doc) {
      return;
    }
    setScreenState('copying');
    await sleep(1);
    const newId = generateId();

    const newDocDate = new Date().toISOString();

    const freeShipments = docList.filter((i) =>
      isCurr ? i.documentType.name === 'currFreeShipment' : i.documentType.name === 'freeShipment',
    );
    const newNumber = getNextDocNumber(freeShipments);

    const newDoc: IFreeShipmentDocument = {
      ...doc,
      id: newId,
      number: newNumber,
      status: 'DRAFT',
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
      sentDate: undefined,
      erpCreationDate: undefined,
    };

    docDispatch(documentActions.addDocument(newDoc));
    navigation.navigate('FreeShipmentView', { id: newId, isCurr });

    setScreenState('copied');
  }, [doc, docList, docDispatch, navigation, isCurr]);

  const handleDelete = useCallback(() => {
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
  const [visibleRequestDialog, setVisibleRequestDialog] = useState(false);

  const sendDoc = useSendDocs(doc ? [doc] : [], doc ? [getDocToSend(doc)] : []);

  const sendRemainsRequest = useSendOneRefRequest('Остатки', { name: 'remains' });

  const handleSendRemainsRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRemainsRequest();
  }, [sendRemainsRequest]);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    await handleSendRemainsRequest();
    setScreenState('sent');
  }, [handleSendRemainsRequest, sendDoc]);

  const handleSendRequest = useCallback(async () => {
    setVisibleRequestDialog(false);
    await sendRemainsRequest();
    handleFocus();
  }, [sendRemainsRequest]);

  const handleCancelRequest = () => {
    setVisibleRequestDialog(false);
    handleFocus();
  };

  const handleSetNewBox = (newBox: IBox) => {
    setBox(newBox);
    setVisibleBoxDialog(false);
    handleFocus();
  };

  const handleCancelBoxDialog = () => {
    setVisibleBoxDialog(false);
    handleFocus();
  };

  const handleAddUnitLine = useCallback(
    async (line: IFreeShipmentLine) => {
      dispatch(documentActions.addDocumentLine({ docId: id, line: box ? { ...line, box } : line }));
      setVisibleBarcodeDialog(false);

      if (box && !(box.numReceived && box.workDate)) {
        setBox({ ...box, numReceived: line.numReceived, workDate: line.workDate });
      }

      handleFocus();
    },
    [box, dispatch, id],
  );

  const handleCancelUnitDialog = () => {
    setVisibleBarcodeDialog(false);
    handleFocus();
  };

  const actionsMenu = useCallback(() => {
    showActionSheet(
      isBlocked
        ? doc?.status === 'SENT'
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
                onPress: handleDelete,
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
              onPress: handleEditDocHead,
            },
            {
              title: 'Копировать документ',
              onPress: handleCopyDoc,
            },
            {
              title: 'Удалить документ',
              type: 'destructive',
              onPress: handleDelete,
            },
            {
              title: 'Отмена',
              type: 'cancel',
              onPress: handleFocus,
            },
          ],
    );
  }, [showActionSheet, isBlocked, doc?.status, handleCopyDoc, handleDelete, hanldeCancelLastScan, handleEditDocHead]);

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
          <View style={styles.buttons}>
            <SendButton
              onPress={() => setVisibleSendDialog(true)}
              disabled={screenState !== 'idle' || loading || !lines?.length}
            />
            <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
          </View>
        ) : (
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        )
      ) : (
        <View style={styles.buttons}>
          {doc?.status === 'DRAFT' && <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />}
          <SendButton
            onPress={() => setVisibleSendDialog(true)}
            disabled={screenState !== 'idle' || loading || !lines?.length}
          />
          <ScanButton
            onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('ScanGood', { docId: id }))}
            disabled={screenState !== 'idle'}
          />
          {usePackage && (
            <PackageButton
              onPress={() => (box ? setBox(undefined) : setVisibleBoxDialog(true))}
              iconColor={box ? 'red' : undefined}
              disabled={screenState !== 'idle'}
            />
          )}
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ),
    [
      actionsMenu,
      box,
      doc?.status,
      handleSaveDocument,
      id,
      isBlocked,
      isScanerReader,
      lines?.length,
      loading,
      navigation,
      screenState,
      usePackage,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const handlePressLine = useCallback(
    (weight: number) => {
      setQuantPack('');
      setQuantPallet('1');
      setVisibleQuantPackDialog(true);
      weight >= goodBarcodeSettings?.boxWeight ? setIsPack(false) : setIsPack(true);
    },
    [goodBarcodeSettings?.boxWeight],
  );

  const [lineType, setLineType] = useState(lineTypes[1].id);

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

  const renderItem = useCallback(
    ({ item }: { item: IFreeShipmentLine }) => {
      return (
        <LineItem
          item={item}
          disabled={
            doc?.status !== 'DRAFT' || scanUnit || item.sortOrder !== lines?.length || Boolean(item.scannedBarcode)
          }
          onPress={() => handlePressLine(item.weight)}
        />
      );
    },
    [doc?.status, handlePressLine, lines?.length, scanUnit],
  );

  const [isDateVisible, setIsDateVisible] = useState(false);

  const [scanned, setScanned] = useState(false);

  const handleErrorMessage = useCallback((visible: boolean, text: string, typeSound?: TypeSound) => {
    if (visible) {
      typeSound && playSound(typeSound);
      setErrorMessage(text);
    } else {
      alertWithSound('Внимание!', `${text}.`, handleFocus, typeSound || 'ERROR');
      setScanned(false);
    }
    handleFocus();
  }, []);

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
        handleErrorMessage(visibleDialog, 'Штрих-код не определён. Повторите сканирование!', 'NOT_DEFINED_BARCODE');
        return;
      }

      if (scanUnit && brc.length === 13) {
        const goodRem = goodRemains.find((item) => item.good.shcode === brc);
        if (!goodRem) {
          setVisibleRequestDialog(true);
          setScanned(false);
          return;
        }

        /////////////////////////////////////////////////////////////
        // if (good.remains >= weight) {
        //   handleErrorMessage(visibleDialog, 'Вес товара превышает вес в остатках!');
        //   return;
        // }

        const good = goods.find((item) => item.shcode === brc && item.isUnit);
        if (!good) {
          handleErrorMessage(visibleDialog, 'Товар не является штучным. Проверьте товар в справочнике!');
          return;
        }

        const newLine: IFreeShipmentLine = {
          good: {
            id: good.id,
            name: good.name,
            shcode: good.shcode,
            isCattle: good?.isCattle,
            goodGroupId: good?.goodGroupId,
            isUnit: Boolean(good?.isUnit),
          },
          id: generateId(),
          quantity: 0,
          barcode: brc,
          workDate: '',
          numReceived: '',
          sortOrder: doc?.lines?.length + 1,
          usedRemains: remainsUse,
          quantPack: 0,
          weight: goodRem.remains,
          unitWeight: good.unitWeight,
        };

        setBrcLine(newLine);
        if (visibleDialog) {
          setVisibleDialog(false);
          setErrorMessage('');
          setBarcode('');
        } else {
          setScanned(false);
        }

        setVisibleBarcodeDialog(true);
        handleFocus();
        return;
      }

      if (!scanUnit && brc.length < minBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!',
          'LENGTH_LESS_MIN',
        );
        return;
      }

      if (brc.length > maxBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода больше максимальной длины, указанной в настройках. Повторите сканирование!',
          'LENGTH_MORE_MAX',
        );
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const lineGood = getLineGood(
        barc.shcode,
        barc.weight,
        goods,
        goodRemains,
        remainsUse,
        goodBarcodeSettings?.countCode || 4,
      );

      if (!lineGood.good) {
        setVisibleRequestDialog(true);
        playSound('NOT_FIND_GOOD');
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
        handleErrorMessage(visibleDialog, 'Вес товара превышает вес в остатках!', 'NOT_REMAINS_GOOD');
        return;
      }

      const line = doc?.lines?.find((i) => i.barcode === barc.barcode || i.scannedBarcode === barc.barcode);

      if (line) {
        handleErrorMessage(visibleDialog, 'Данный штрих-код уже добавлен!', 'DUBLICATE_BARCODE');
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
        usedRemains: remainsUse,
      };

      const boxLine = box
        ? doc?.lines?.find(
            (i) => i.box?.id === box?.id && (i.good.id !== newLine.good.id || i.numReceived !== newLine.numReceived),
          )
        : null;

      if (boxLine) {
        handleErrorMessage(
          visibleDialog,
          'Нельзя поместить разные товары или товары с разными партиями в одну коробку!',
        );
        return;
      }

      dispatch(documentActions.addDocumentLine({ docId: id, line: box ? { ...newLine, box } : newLine }));

      if (box && !(box.numReceived && box.workDate)) {
        setBox({ ...box, numReceived: newLine.numReceived, workDate: box.workDate });
      }

      playSound('OK');

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
      scanUnit,
      minBarcodeLength,
      maxBarcodeLength,
      goodBarcodeSettings,
      goods,
      goodRemains,
      remainsUse,
      isCattle,
      box,
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
    if (screenState === 'sent' || screenState === 'deleted' || screenState === 'copied') {
      setScreenState('idle');
      if (screenState !== 'copied') {
        navigation.goBack();
      }
    }
  }, [navigation, screenState]);

  const isEditable = useMemo(() => (doc ? ['DRAFT', 'READY'].includes(doc?.status) : false), [doc]);

  const viewStyle: StyleProp<ViewStyle> = useMemo(
    () => ({ ...styles.container, justifyContent: lineType === 'last' ? 'flex-start' : 'center' }),
    [lineType],
  );

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting' || screenState === 'sending' || screenState === 'copying') {
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

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <View style={viewStyle}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        isBlocked={isBlocked}
        onPress={() => (isEditable ? handleEditDocHead() : setIsDateVisible(!isDateVisible))}
        editable={isEditable}
      >
        <View style={styles.infoBlock}>
          <MediumText>{doc.head.fromDepart?.name || ''}</MediumText>
          <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
          {isDateVisible && <DateInfo sentDate={doc.sentDate} erpCreationDate={doc.erpCreationDate} />}
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
      {lineType === 'all' ? (
        <>
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
        </>
      ) : lineType === 'last' && lines?.[0] ? (
        <View style={styles.spaceBetween}>
          <LineItem
            item={lines?.[0]}
            disabled={doc?.status !== 'DRAFT' || scanUnit || Boolean(lines?.[0]?.scannedBarcode)}
            onPress={() => handlePressLine(lines?.[0]?.weight)}
          />
          {lines?.length ? <ViewTotal quantPack={lineSum?.quantPack || 0} weight={lineSum?.weight || 0} /> : null}
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
      {usePackage && (
        <BoxDialog
          visible={visibleBoxDialog}
          onCancel={handleCancelBoxDialog}
          onOk={handleSetNewBox}
          okLabel={'Ок'}
          keyboardType="numbers-and-punctuation"
          okDisabled={!quantPack || !quantPallet}
          screenName="FreeShipmentView"
          lastBox={lines?.[0]?.box || undefined}
        />
      )}
      {scanUnit && (
        <BarcodeDialog
          visible={visibleBarcodeDialog}
          onCancel={handleCancelUnitDialog}
          onOk={handleAddUnitLine}
          okLabel={'Ок'}
          keyboardType="numbers-and-punctuation"
          okDisabled={!quantPack || !quantPallet}
          screenName="FreeShipmentView"
          line={brcLine}
          box={box}
          remainsUse={remainsUse}
        />
      )}
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
        onCancel={handleCancelRequest}
        onOk={handleSendRequest}
        okDisabled={loading}
      />
    </View>
  );
};
