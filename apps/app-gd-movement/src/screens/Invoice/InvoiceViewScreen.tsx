import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Alert, TextInput } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute, useTheme } from '@react-navigation/native';
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
} from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { Searchbar } from 'react-native-paper';

import { IInvoiceDocument, IInvoiceLine } from '../../store/types';
import { InvoiceStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import { IGood } from '../../store/app/types';

import DocTotal from './components/DocTotal';

export const InvoiceViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<InvoiceStackParamList, 'InvoiceView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [searchVisible, setSearchVisible] = useState(false);

  const id = useRoute<RouteProp<InvoiceStackParamList, 'InvoiceView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IInvoiceDocument>(id);

  const loading = useSelector((state) => state.app.loading);

  const docLineQuantity = doc?.lines?.reduce((sum, line) => sum + line.quantity, 0) || 0;
  const docLineSum = useMemo(
    () => doc?.lines?.reduce((sum, line) => sum + line.quantity * (line?.price || 0), 0) || 0,
    [doc?.lines],
  );

  const [searchQuery, setSearchQuery] = useState('');

  const lines = useMemo(() => {
    return (
      doc?.lines
        ?.filter((i) => (i.good.name ? i.good.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || []
    );
  }, [doc?.lines, searchQuery]);

  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  const { colors } = useTheme();

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

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
    navigation.navigate('InvoiceEdit', { id });
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
  3;
  const renderItem = ({ item }: { item: IInvoiceLine }) => {
    const good = goods?.find((e) => e.id === item?.good.id);
    return (
      <ListItemLine
        key={item.id}
        onPress={() =>
          isDelList
            ? setDelList(getDelLineList(delList, item.id))
            : !isBlocked && navigation.navigate('InvoiceLine', { mode: 1, docId: id, item })
        }
        onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
        checked={delList.includes(item.id)}
      >
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <View style={styles.directionRow}>
            <MediumText>
              {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
            </MediumText>
            {!!item.barcode && <MediumText style={[styles.number, styles.flexDirectionRow]}>{item.barcode}</MediumText>}
          </View>
        </View>
      </ListItemLine>
    );
  };

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

      const line = doc.lines.find((item) => item.barcode === brc);

      if (!line) {
        Alert.alert('Внимание!', 'Позиция с данным товаром не найдена', [
          {
            text: 'ОК',
          },
        ]);
        handleFocus();

        return;
      }

      navigation.navigate('InvoiceLine', { mode: 1, docId: id, item: line });
    },

    [doc, id, isBlocked, navigation],
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
        title={doc.head.depart.name || ''}
        onPress={() => (isEditable ? handleEditDocHead() : setIsDateVisible(!isDateVisible))}
        editable={!isEditable}
        disabled={delList.length > 0}
        isBlocked={isBlocked}
      >
        <>
          {doc.head.fromContact && (
            <MediumText
              style={styles.rowCenter}
            >{`${doc.documentType.fromDescription}: ${doc.head.fromContact?.name}`}</MediumText>
          )}

          <MediumText style={styles.rowCenter}>{doc.documentType.description || ''}</MediumText>

          <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
          {isDateVisible && <DateInfo sentDate={doc.sentDate} erpCreationDate={doc.erpCreationDate} />}
        </>
      </InfoBlock>
      {searchVisible && (
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
      )}
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
          sum={docLineSum}
          quantity={docLineQuantity}
          sumWNds={doc?.documentType?.isSumWNds}
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
    </View>
  );
};
