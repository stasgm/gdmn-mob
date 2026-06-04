import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  AppActivityIndicator,
  AppDialog,
  AppScreen,
  CloseButton,
  DateInfo,
  DeleteButton,
  ItemSeparator,
  InfoBlock,
  LargeText,
  ListItemLine,
  MediumText,
  MenuButton,
  SaveDocument,
  SendButton,
  SimpleDialog,
  globalStyles as styles,
  navBackButton,
  useActionSheet,
  ScanButton,
} from '@lib/mobile-ui';
import {
  deleteSelectedLineItems,
  generateId,
  getDateString,
  getDelLineList,
  keyExtractor,
  sleep,
  useSendDocs,
} from '@lib/mobile-hooks';

import { FlashList } from '@shopify/flash-list';

import { ScreenState } from '@lib/types';

import { CellMovementStackParamList } from '../../navigation/Root/types';
import { ICellMovementDocument, ICellMovementLine, IReceiptDocument, IReceiptLine } from '../../store/types';
import { IGood } from '../../store/app/types';
import { QuantityDialog } from '../../components/QuantityDialog';
import { alertWithSound } from '../../utils/cellHelpers';
import { ONE_SECOND_IN_MS, getStatusColor } from '../../utils/constants';

export const CellMovementViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<CellMovementStackParamList, 'CellMovementView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const id = useRoute<RouteProp<CellMovementStackParamList, 'CellMovementView'>>().params?.id;
  const doc = docSelectors.selectByDocId<ICellMovementDocument>(id);
  console.log('doc.head', doc?.head);

  const docs = useSelector((state) => state.documents.list) as IReceiptDocument[];

  const list = docs?.filter((i) => i.documentType.subtype === 'was' && i.documentType.name === 'prihod');

  const prihodLines = list?.reduce((prev: IReceiptLine[], curr: IReceiptDocument) => [...prev, ...curr.lines], []);

  const loading = useSelector((state) => state.app.loading);
  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);
  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || [], [doc?.lines]);
  const lineCount = lines.length;
  const totalQuantity = useMemo(() => lines.reduce((sum, line) => sum + (line.quantity || 0), 0), [lines]);
  const isBlocked = doc?.status !== 'DRAFT';
  const isEditable = useMemo(() => (doc ? ['DRAFT', 'READY'].includes(doc.status) : false), [doc]);

  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = !!Object.keys(delList).length;

  const handleEditDocHead = useCallback(() => {
    if (!id) {
      return;
    }
    navigation.navigate('CellMovementEdit', { id });
  }, [id, navigation]);

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

  const handleDeleteDocs = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    setScreenState('sent');
  }, [sendDoc]);

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
  }, [dispatch, doc, id, navigation]);

  const ref = useRef<TextInput>(null);
  const [scanKey, setScanKey] = useState(1);

  const [codeDialogVisible, setCodeDialogVisible] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [codeError, setCodeError] = useState('');
  const [quantityDialogVisible, setQuantityDialogVisible] = useState(false);
  const [scannedLineForQuantity, setScannedLineForQuantity] = useState<ICellMovementLine | null>(null);

  const [isDateVisible, setIsDateVisible] = useState(false);

  const handleFocus = useCallback(() => {
    ref?.current?.focus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (ref.current) {
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, ONE_SECOND_IN_MS);
      }
    }, []),
  );

  const getScannedObject = useCallback(
    (code: string) => {
      if (!doc || isBlocked) {
        return;
      }

      if (!(doc.head.toDepartment?.isAddressStore || doc.head.fromDepartment?.isAddressStore)) {
        alertWithSound('Ошибка!', 'Подразделение должно быть адресного типа.');
        return;
      }

      // EAN-13–like: strip leading zeros and drop last (check) digit
      const normalized = code.trim().replace(/^0+/, '').slice(0, -1);
      if (!normalized) {
        return;
      }

      const line = prihodLines?.find((i) => i.id === normalized);
      if (!line) {
        alertWithSound('Ошибка!', 'Товар не найден');
        return;
      }

      const good = goods?.find((i) => i.id === line.good.id);
      if (!good) {
        alertWithSound('Ошибка!', 'Товар не найден');
        return;
      }
      // const good =
      //   goods?.find((i) => i.barcode === trimmed) ||
      //   goods?.find((i) => i.alias === trimmed) ||
      //   goods?.find((i) => i.weightCode === trimmed);

      console.log('line', line);
      const scannedLine: ICellMovementLine = {
        id: generateId(),
        good: { id: good.id, name: good.name },
        quantity: line.quantity || 1,
        barcode: normalized,
        dateReceive: line.dateReceive,
        price: line.price,
        sortOrder: (lines?.[0]?.sortOrder || 0) + 1,
      };

      setScannedLineForQuantity(scannedLine);
      setQuantityDialogVisible(true);
    },
    [doc, goods, isBlocked, lines, prihodLines],
  );

  const setScan = useCallback(
    (brc: string) => {
      setScanKey((prev) => prev + 1);
      getScannedObject(brc);
    },
    [getScannedObject],
  );

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Редактировать данные',
        onPress: handleEditDocHead,
      },
      {
        title: 'Сканировать товар',
        onPress: handleFocus,
      },
      {
        title: 'Ввести код',
        onPress: () => {
          setCodeError('');
          setCodeValue('');
          setCodeDialogVisible(true);
        },
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
    ]);
  }, [handleDelete, handleEditDocHead, handleFocus, showActionSheet]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        doc?.status === 'READY' ? (
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
        ) : (
          doc?.status === 'DRAFT' && <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
        )
      ) : (
        // <View style={styles.buttons}>
        //   {isDelList ? <DeleteButton onPress={handleDeleteDocs} /> : <MenuButton actionsMenu={actionsMenu} />}
        // </View>
        <View style={styles.buttons}>
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocs} />
          ) : (
            <>
              {doc?.status === 'DRAFT' && (
                <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
              <ScanButton onPress={() => (isScanerReader ? handleFocus() : null)} disabled={screenState !== 'idle'} />

              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [
      actionsMenu,
      doc?.status,
      handleDeleteDocs,
      handleFocus,
      handleSaveDocument,
      isBlocked,
      isDelList,
      isScanerReader,
      loading,
      screenState,
    ],
  );

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isBlocked, isDelList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: isDelList ? `Выделено позиций: ${delList.length}` : 'Документ',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight]);

  const handleEditLine = useCallback(
    (line: ICellMovementLine) => {
      if (isBlocked || !id) {
        return;
      }
      navigation.navigate('SelectCell', { mode: 1, docId: id, item: line });
    },
    [id, isBlocked, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ICellMovementLine }) => {
      console.log('item', item);
      console.log('delList.includes(item.id)', delList.includes(item.id));
      console.log('isDelList', isDelList);
      // console.log('delList', delList);

      return (
        <ListItemLine
          // {...item}
          key={item.id}
          onPress={() => (isDelList ? setDelList(getDelLineList(delList, item.id)) : handleEditLine(item))}
          // onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
          onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
          checked={delList.includes(item.id)}
        >
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{item.good?.name || 'Неизвестный товар'}</LargeText>

            {item.fromCell ? <MediumText>{`Откуда: ${item.fromCell}`}</MediumText> : null}
            {item.toCell ? <MediumText>{`Куда: ${item.toCell}`}</MediumText> : null}
            <View style={styles.directionRow}>
              <MediumText>{`Кол-во: ${item.quantity || 0}`}</MediumText>
              {item.price ? (
                <MediumText style={[styles.number, styles.flexDirectionRow]}>{`Цена: ${item.price} р.`}</MediumText>
              ) : null}
              <MediumText style={[styles.number, styles.flexDirectionRow]}>
                {item.barcode ? item.barcode : item.id}
              </MediumText>

              {/* {!!item.barcode && <MediumText style={[styles.number, styles.flexDirectionRow]}>{item.barcode}</MediumText>} */}
            </View>
            {item.dateReceive ? (
              <MediumText style={[styles.number, styles.flexDirectionRow]}>{`Дата получения: ${getDateString(
                new Date(item.dateReceive),
              )}`}</MediumText>
            ) : null}
          </View>
        </ListItemLine>
      );
    },
    [delList, isBlocked, isDelList, handleEditLine],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <AppScreen>
      <InfoBlock
        colorLabel={getStatusColor(doc.status || 'DRAFT')}
        title={doc.head.documentSubtype?.name || ''}
        onPress={() => (isEditable ? handleEditDocHead() : setIsDateVisible((prev) => !prev))}
        editable={!isEditable}
        disabled={delList.length > 0}
        isBlocked={isBlocked}
      >
        <>
          <View style={styles.contentTop}>
            <LargeText style={styles.textBold}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</LargeText>
            {doc.head?.fromDepartment?.name ? (
              <MediumText>{`Откуда: ${doc.head.fromDepartment.name}`}</MediumText>
            ) : null}
            {doc.head?.toDepartment?.name ? <MediumText>{`Куда: ${doc.head.toDepartment.name}`}</MediumText> : null}
            {doc.head?.comment ? <MediumText>{`Комментарий: ${doc.head.comment}`}</MediumText> : null}
            {/* <MediumText>{`Позиций: ${lineCount}  Кол-во: ${totalQuantity}`}</MediumText> */}
            {isDateVisible ? <DateInfo sentDate={doc.sentDate} erpCreationDate={doc.erpCreationDate} /> : null}
          </View>
        </>
      </InfoBlock>
      {isScanerReader ? (
        <TextInput
          style={styles.scanInput}
          key={scanKey}
          autoFocus={true}
          selectionColor="transparent"
          ref={ref}
          showSoftInputOnFocus={false}
          onChangeText={(text) => setScan(text)}
        />
      ) : null}
      <FlashList
        data={lines}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        extraData={[delList, isDelList, isBlocked]}
      />
      {lines.length ? <CellMovementTotal lineCount={lineCount} quantity={totalQuantity} /> : null}
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Вы уверены, что хотите отправить документы?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
      <QuantityDialog
        visible={quantityDialogVisible}
        line={scannedLineForQuantity}
        onConfirm={(lineWithQuantity) => {
          if (!doc) {
            return;
          }
          setQuantityDialogVisible(false);
          setScannedLineForQuantity(null);
          navigation.navigate('SelectCell', {
            mode: 0,
            docId: doc.id,
            item: lineWithQuantity,
            docType: doc.documentType?.name,
          });
        }}
        onCancel={() => {
          setQuantityDialogVisible(false);
          setScannedLineForQuantity(null);
        }}
      />
      <AppDialog
        visible={codeDialogVisible}
        title="Введите код"
        text={codeValue}
        onChangeText={(text) => {
          setCodeError('');
          setCodeValue(text);
        }}
        onCancel={() => setCodeDialogVisible(false)}
        onOk={() => {
          if (!codeValue.trim()) {
            setCodeError('Введите код.');
            return;
          }
          getScannedObject(codeValue);
          setCodeDialogVisible(false);
        }}
        errorMessage={codeError}
        okDisabled={screenState !== 'idle' || isBlocked}
      />
    </AppScreen>
  );
};

const CellMovementTotal = ({ lineCount, quantity }: { lineCount: number; quantity: number }) => (
  <View style={totalStyles.container}>
    <MediumText>{`Позиций: ${lineCount}`}</MediumText>
    <MediumText>{`Кол-во: ${quantity}`}</MediumText>
  </View>
);

const totalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
