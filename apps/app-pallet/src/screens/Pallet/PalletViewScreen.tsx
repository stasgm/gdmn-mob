import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Alert, useWindowDimensions, Keyboard } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { appActions, docSelectors, documentActions, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  ScanButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  ListItemLine,
  navBackButton,
  SaveDocument,
  SimpleDialog,
  DateInfo,
  AppDialog,
  DeleteButton,
  CloseButton,
} from '@lib/mobile-ui';

import {
  generateId,
  getDateString,
  shortenString,
  useSendDocs,
  sleep,
  keyExtractor,
  deleteSelectedLineItems,
  getDelLineList,
} from '@lib/mobile-hooks';

import { ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { IPalletDocument, IPalletLine } from '../../store/types';
import { PalletStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import { jsonFormat } from '../../utils/helpers';

import { BarcodeImage } from './components/Barcode';

export const PalletViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const navigation = useNavigation<StackNavigationProp<PalletStackParamList, 'PalletView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const id = useRoute<RouteProp<PalletStackParamList, 'PalletView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IPalletDocument>(id);
  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);
  const loading = useSelector((state) => state.app.loading);

  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);
  const prefixErp = useSelector((state) => state.settings?.data?.prefixErp?.data);
  const prefixS = useSelector((state) => state.settings?.data?.prefixS?.data);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDateVisible, setIsDateVisible] = useState(false);

  const ref = useRef<TextInput>(null);

  const handleFocus = () => {
    ref?.current?.focus();
  };

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

  const handleDeleteLines = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id, setDelList]);

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
  }, [dispatch, id, doc, navigation]);

  const hanldeCancelLastPallet = useCallback(() => {
    const lastId = doc?.lines?.[0]?.id;

    if (lastId) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
    }
    handleFocus();
  }, [dispatch, doc?.lines, id]);

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
        title: 'Отменить последнее сканирование',
        onPress: hanldeCancelLastPallet,
      },
      {
        title: 'Ввести штрих-код',
        onPress: handleShowDialog,
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
  }, [showActionSheet, hanldeCancelLastPallet, handleDelete]);

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
            <DeleteButton onPress={handleDeleteLines} />
          ) : (
            <>
              {doc?.status === 'DRAFT' && (
                <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />

              <ScanButton
                onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('PalletGood', { docId: id }))}
                disabled={screenState !== 'idle'}
              />
              {/* )} */}
              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [
      actionsMenu,
      doc?.status,
      handleDeleteLines,
      handleSaveDocument,
      id,
      isBlocked,
      isDelList,
      isScanerReader,
      loading,
      navigation,
      screenState,
    ],
  );

  const windowWidth = useWindowDimensions().width;

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isBlocked, isDelList],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: windowWidth > 320 ? 'Документ' : '',
    });
  }, [isDelList, navigation, renderLeft, renderRight, windowWidth]);

  const renderItem = ({ item }: { item: IPalletLine }) => (
    <ListItemLine
      {...item}
      // readonly={true}
      onPress={() => isDelList && setDelList(getDelLineList(delList, item.id))}
      onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
      checked={delList.includes(item.id)}
    >
      <View style={styles.details}>
        <LargeText>{shortenString(item.barcode, 30)}</LargeText>
      </View>
    </ListItemLine>
  );

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      Alert.alert('Внимание!', `${text}.`, [
        {
          text: 'ОК',
          onPress: handleFocus,
        },
      ]);
      setScanned(false);
    }
    handleFocus();
  }, []);
  const [scanned, setScanned] = useState(false);

  const [key, setKey] = useState(1);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        setScanned(false);
        handleFocus();
        return;
      }

      if (isBlocked) {
        setScanned(false);
        handleFocus();
        return;
      }

      if (brc.slice(0, 2) !== prefixErp && brc.slice(0, 2) !== prefixS) {
        handleErrorMessage(visibleDialog, 'Баркод неверного формата');
        setScanned(false);
        handleFocus();
        return;
      }

      if (doc.lines?.find((l) => l.barcode === brc)) {
        setScanned(false);
        handleFocus();
        return;
      }

      const line: IPalletLine = { id: generateId(), barcode: brc, sortOrder: (lines?.[0]?.sortOrder || 0) + 1 };
      dispatch(documentActions.addDocumentLine({ docId: id, line }));

      if (visibleDialog) {
        setVisibleDialog(false);
        setErrorMessage('');
        setBarcode('');
      } else {
        setScanned(false);
      }

      handleFocus();
    },
    [dispatch, doc, handleErrorMessage, id, isBlocked, lines, prefixErp, prefixS, visibleDialog],
  );

  const handleSearchBarcode = () => {
    getScannedObject(barcode);
  };

  const setPallet = (brc: string) => {
    setKey(key + 1);
    setScanned(true);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref?.current &&
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, ONE_SECOND_IN_MS);
    }
  }, [scanned, ref]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const isEditable = useMemo(() => (doc ? ['DRAFT', 'READY'].includes(doc?.status) : false), [doc]);

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

  console.log('doc', jsonFormat(doc));

  return (
    <>
      <View style={styles.container}>
        <InfoBlock
          colorLabel={getStatusColor(doc?.status || 'DRAFT')}
          title={doc.documentType.description || ''}
          onPress={() => !isEditable && setIsDateVisible(!isDateVisible)}
          isBlocked={isBlocked}
          disabled={delList.length > 0}
        >
          <>
            <View style={styles.rowCenter}>
              <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
            </View>
            <BarcodeImage barcode={doc?.head.palletId} />
            {isDateVisible && <DateInfo sentDate={doc.sentDate} erpCreationDate={doc.erpCreationDate} />}
          </>
        </InfoBlock>
        <TextInput
          style={styles.scanInput}
          key={key}
          autoFocus={true}
          selectionColor="transparent"
          ref={ref}
          showSoftInputOnFocus={false}
          onChangeText={(text) => !scanned && setPallet(text)}
        />
        <FlashList
          data={lines}
          renderItem={renderItem}
          estimatedItemSize={60}
          ItemSeparatorComponent={ItemSeparator}
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          extraData={[lines, isBlocked, delList, isDelList]}
        />
        <AppDialog
          title="Введите штрих-код"
          visible={visibleDialog}
          text={barcode}
          onChangeText={setBarcode}
          onCancel={handleDismissBarcode}
          onOk={handleSearchBarcode}
          okLabel={'ОК'}
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
    </>
  );
};
