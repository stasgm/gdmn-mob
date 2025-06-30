import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Alert, TextInput } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  ScanButton,
  CloseButton,
  DeleteButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  ListItemLine,
  navBackButton,
  SaveDocument,
  SimpleDialog,
  DateInfo,
  SearchButton,
} from '@lib/mobile-ui';

import {
  deleteSelectedLineItems,
  getDateString,
  getDelLineList,
  useSendDocs,
  sleep,
  keyExtractor,
  generateId,
} from '@lib/mobile-hooks';

import { ISettingsOption, ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { MD2Theme, Searchbar, useTheme } from 'react-native-paper';

import { IWaybillDocument, IWaybillLine } from '../../store/types';
import { WaybillStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import { IGood } from '../../store/app/types';

import { jsonFormat } from '../../utils/helpers';

import DocTotal from './components/WaybillTotal';
import { WaybillDialog } from './components/WaybillDialog';

export const WaybillViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<WaybillStackParamList, 'WaybillView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [searchVisible, setSearchVisible] = useState(false);

  const id = useRoute<RouteProp<WaybillStackParamList, 'WaybillView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IWaybillDocument>(id);
  console.log('jsonFormat', doc);
  const loading = useSelector((state) => state.app.loading);

  const lines = useMemo(() => {
    return doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || [];
  }, [doc?.lines]);

  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  const ref = useRef<TextInput>(null);

  const [isDateVisible, setIsDateVisible] = useState(false);

  const handleFocus = () => {
    ref?.current?.focus();
  };

  useFocusEffect(
    useCallback(() => {
      if (ref?.current) {
        ref?.current &&
          setTimeout(() => {
            ref.current?.focus();
            ref.current?.clear();
          }, ONE_SECOND_IN_MS);
      }
    }, [ref]),
  );

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('WaybillEdit', { id });
  }, [navigation, id]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: id });
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
        onPress: () => handleFocus(),
      },
    ]);
  }, [docDispatch, id]);

  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = !!Object.keys(delList).length;

  const handleDeleteDocs = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id, setDelList]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

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
        onPress: handleFocus,
      },
    ]);
  }, [showActionSheet, handleDelete, handleEditDocHead]);

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
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocs} />
          ) : (
            <>
              {doc?.status === 'DRAFT' && (
                <>
                  {/* <View style={styles.buttons}> */}
                  <SearchButton onPress={() => setSearchVisible((prev) => !prev)} visible={searchVisible} />
                  {/* {isScanerReader && <ScanButton onPress={handleScanner} />} */}
                  {/* </View> */}
                  <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
                </>
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
              <ScanButton
                onPress={() => (isScanerReader ? handleFocus() : handleDoScan())}
                disabled={screenState !== 'idle'}
              />

              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [
      actionsMenu,
      doc?.status,
      handleDeleteDocs,
      handleDoScan,
      handleSaveDocument,
      isBlocked,
      isDelList,
      isScanerReader,
      loading,
      screenState,
      searchVisible,
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
      title: isDelList ? `Выделено позиций: ${delList.length}` : '',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const [visibleLineDialog, setVisibleLineDialog] = useState(false);
  const [selectedLine, setSelectedLine] = useState<IWaybillLine | undefined>(undefined);

  const handleDismissLineDialog = () => {
    setVisibleLineDialog(false);
    setSelectedLine(undefined);
  };

  const renderItem = ({ item }: { item: IWaybillLine }) => {
    const good = goods?.find((e) => e.id === item?.goodId);

    const handleOnPress = () => {
      setVisibleLineDialog(true);
      setSelectedLine({ ...item, goodId: good?.name || '' });
    };

    const lineStyle = {
      backgroundColor: item.checked ? 'rgba(65, 177, 237, 0.25)' : item.added ? 'rgba(255, 0, 0, 0.25)' : 'transparent',
      // opacity: item.added ? 0.2 : 1,#b5d0ff
    };

    return (
      <View style={lineStyle}>
        <ListItemLine
          key={item.id}
          onPress={() => (isDelList ? setDelList(getDelLineList(delList, item.id)) : !isBlocked && handleOnPress())}
          onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
          checked={delList.includes(item.id)}
        >
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{good?.name}</LargeText>
            <View style={styles.directionRow}>
              <MediumText>{item.EID}</MediumText>
              {/* <MediumText>
              {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
            </MediumText>
            {!!item.barcode && <MediumText style={[styles.number, styles.flexDirectionRow]}>{item.barcode}</MediumText>} */}
            </View>
          </View>
        </ListItemLine>
      </View>
    );
  };

  //const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  // const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;
  // const documentType = useMemo(
  //   () => documentTypes?.find((d) => d.id === doc?.documentType.id),
  //   [doc?.documentType.id, documentTypes],
  // );

  const settings = useSelector((state) => state.settings?.data);

  const prefixGtin = (settings.prefixGtin as ISettingsOption<string>)?.data || '';
  const prefixISN = (settings.prefixISN as ISettingsOption<string>)?.data || '';
  // const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  // const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>)?.data || 0;
  // const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>)?.data || 0;
  // const isInputQuantity = settings.quantityInput?.data;

  const [key, setKey] = useState(1);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (isBlocked) {
        return;
      }

      if (!brc) {
        return;
      }

      console.log('brc', brc);
      //const charFrom = 0;
      //const charTo = weightSettingsWeightCode.data.length;

      // let scannedObject: IWaybillLine;
      // const regIsTypeDM = RegExp(`^.{0,1}${prefixGtin}\\d{13,14}${prefixISN}.{10,13}`, 'i');
      // // const regIsTypeDM0 = RegExp(`^.{0,1}${prefixGtin}\\d{13,14}${prefixISN}.{13}91.{1,4}92.{1,44}`, 'i');

      // if (regIsTypeDM) {
      //   Alert.alert('Внимание!', 'Отсканирован код маркировки! Отсканируйте штрихкод товара.', [
      //     {
      //       text: 'ОК',
      //     },
      //   ]);
      //   handleFocus();

      //   return;
      // }

      const line = doc.lines.find((item) => item.EID === brc);
      console.log('line', line);
      if (line) {
        const newLine: IWaybillLine = { ...line, checked: true };
        dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
        handleFocus();
        console.log('123');
        return;
      }

      if (!line) {
        const regIsTypeDM = RegExp(`^.{0,1}${prefixGtin}\\d{13,14}${prefixISN}.{10,13}`, 'i');
        const gtin = brc.match(RegExp(`${prefixGtin}0?\\d{13}${prefixISN}`));

        console.log('brc', brc);
        console.log('gtin[0].slice(2, -2)', gtin?.[0].slice(2, -2));
        console.log('gtin[0].slice(3, -2)', gtin?.[0].slice(3, -2));
        const good = goods?.find(
          (e) => gtin && (e.barcode === gtin[0].slice(2, -2) || gtin[0].slice(3, -2) === e?.barcode),
        );
        Alert.alert(
          `${good ? `${good.name}` : 'Внимание!'} `,
          'Позиция с данным кодом маркировки не найдена.  \n\nДобавить в документ?',
          [
            {
              text: 'ОК',
              onPress: () => {
                const newLine: IWaybillLine = {
                  id: generateId(),
                  goodId: good?.id || 'unknown',
                  added: true,
                  sortOrder: (doc.lines?.length || 0) + 1,
                  EID: brc,
                };
                dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
                handleFocus();
              },
            },
            {
              text: 'Отмена',
            },
          ],
        );
        handleFocus();

        return;
      }

      // navigation.navigate('WaybillLine', { mode: 1, docId: id, item: line });
    },

    [dispatch, doc, goods, id, isBlocked, prefixGtin, prefixISN],
  );

  const setScan = (brc: string) => {
    setKey(key + 1);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const isEditable = useMemo(() => (doc ? ['DRAFT', 'READY'].includes(doc?.status) : false), [doc]);

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
        colorLabel={getStatusColor(doc.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={() => (isEditable ? handleEditDocHead() : setIsDateVisible(!isDateVisible))}
        editable={!isEditable}
        disabled={delList.length > 0}
        isBlocked={isBlocked}
      >
        <MediumText style={styles.rowCenter}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
      </InfoBlock>
      {/* {searchVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск (штрихкод, наименование, артикул)"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={searchStyle}
            />
          </View>
          <ItemSeparator />
        </>
      )} */}
      {isScanerReader ? (
        <TextInput
          style={styles.scanInput}
          key={key}
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
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        extraData={[goods, delList, isDelList, isBlocked, navigation, id]}
      />
      {doc.lines?.length ? (
        <DocTotal
          lineCount={doc.lines?.length || 0}
          // sum={docLineSum}
          // quantity={docLineQuantity}
          // sumWNds={doc?.documentType?.isSumWNds}
        />
      ) : null}
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Вы уверены, что хотите отправить документ?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
      <WaybillDialog visible={visibleLineDialog} onDismissDialog={handleDismissLineDialog} item={selectedLine} />
    </View>
  );
};
