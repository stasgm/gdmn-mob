import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Alert, useWindowDimensions } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  appActions,
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
  ScanButton,
  DeleteButton,
  CloseButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  ListItemLine,
  navBackButton,
  SaveDocument,
  SimpleDialog,
} from '@lib/mobile-ui';

import {
  deleteSelectedLineItems,
  generateId,
  getDateString,
  getDelLineList,
  shortenString,
  useSendDocs,
  sleep,
  keyExtractor,
} from '@lib/mobile-hooks';

import { INamedEntity, ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { IRevisionDocument, IRevisionLine } from '../../store/types';
import { RevisionStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS, unknownGood } from '../../utils/constants';
import { getRemGoodByContact } from '../../utils/helpers';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';

export const RevisionViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const navigation = useNavigation<StackNavigationProp<RevisionStackParamList, 'RevisionView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const id = useRoute<RouteProp<RevisionStackParamList, 'RevisionView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IRevisionDocument>(id);
  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);
  const loading = useSelector((state) => state.app.loading);

  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const contactId = useMemo(() => doc?.head?.department?.id, [doc?.head?.department?.id]);

  const [goodRemains] = useState<IMGoodData<IMGoodRemain>>(() =>
    contactId ? getRemGoodByContact(goods, remains[contactId], true) : {},
  );

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useRef<TextInput>(null);

  const handleFocus = () => {
    ref?.current?.focus();
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('RevisionEdit', { id });
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

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = doc?.lines?.[0]?.id;

    if (lastId) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
    }
    handleFocus();
  }, [dispatch, doc?.lines, id]);

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
        onPress: handleFocus,
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditDocHead, handleDelete]);

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
                <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
              <ScanButton
                onPress={() => (isScanerReader ? handleFocus() : navigation.navigate('RevisionGood', { docId: id }))}
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

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isBlocked, isDelList, setDelList],
  );

  const windowWidth = useWindowDimensions().width;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: isDelList
        ? windowWidth > 320
          ? `Выделено позиций: ${delList.length}`
          : `Позиций: ${delList.length}`
        : windowWidth > 320
          ? 'Документ'
          : '',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight, windowWidth]);

  const renderItem = ({ item }: { item: IRevisionLine; index: number }) => (
    <ListItemLine
      {...item}
      onPress={() => {
        isDelList && setDelList(getDelLineList(delList, item.id));
      }}
      onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
      checked={delList.includes(item.id)}
    >
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.good?.name ? item.good.name : 'Неизвестный товар'}</LargeText>
        <MediumText>{shortenString(item.barcode, 30)}</MediumText>
      </View>
    </ListItemLine>
  );

  const [scanned, setScanned] = useState(false);

  const [key, setKey] = useState(1);

  const [currentLineId, setCurrentLineId] = useState('');
  const good = useSelector((state) => state.app.formParams?.good) as INamedEntity | undefined;

  useEffect(() => {
    if (doc && good && currentLineId) {
      const currentLine = doc.lines?.find((l) => l.id === currentLineId);
      if (currentLine && currentLine.good?.id !== good?.id) {
        dispatch(
          documentActions.updateDocumentLine({
            docId: doc.id,
            line: { ...currentLine, good, withGood: true } as IRevisionLine,
          }),
        );
        setCurrentLineId('');
        dispatch(appActions.setFormParams({ good: undefined }));
      }
    }
  }, [currentLineId, dispatch, doc, good]);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (isBlocked) {
        return;
      }

      const remItem = goodRemains[brc];

      if (remItem) {
        const line: IRevisionLine = {
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          sortOrder: (lines?.length || 0) + 1,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode || brc || '',
        };

        Alert.alert(
          remItem.good.name,
          `Цена: ${remItem.remains?.length ? remItem.remains[0].price : 0} р., остаток: ${
            remItem.remains?.length ? remItem.remains?.[0].q : 0
          }`,
          [
            {
              text: 'Добавить',
              onPress: () => {
                dispatch(documentActions.addDocumentLine({ docId: id, line: line }));
                handleFocus();
              },
            },
            { text: 'Отмена' },
          ],
        );
        setScanned(false);

        return;
      }

      const refGood = goods.find((i) => i.barcode === brc);
      if (refGood) {
        const line: IRevisionLine = {
          good: { id: refGood.id, name: refGood.name },
          id: generateId(),
          barcode: brc,
          sortOrder: (lines?.length || 0) + 1,
          price: refGood.price || 0,
        };
        Alert.alert(refGood.name, `Цена: ${refGood.price || 0} р.`, [
          {
            text: 'Добавить',
            onPress: () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: line }));
              handleFocus();
            },
          },
          { text: 'Отмена' },
        ]);

        setScanned(false);

        return;
      }

      if (!remItem && !refGood) {
        const line = lines?.find((i) => i.barcode === brc);

        if (line) {
          Alert.alert(`Штрихкод ${brc} уже привязан`, 'Заменить товар?', [
            {
              text: 'Заменить',
              onPress: () => {
                setCurrentLineId(line.id);
                navigation.navigate('SelectRefItem', {
                  refName: 'good',
                  fieldName: 'good',
                });

                handleFocus();
              },
            },

            { text: 'Отмена', onPress: handleFocus },
          ]);
          return;
        }

        const newLine: IRevisionLine = {
          good: unknownGood,
          id: generateId(),
          barcode: brc,
          sortOrder: (lines?.length || 0) + 1,
          withGood: true,
        };
        Alert.alert('Товар не найден', brc, [
          {
            text: 'Добавить',
            onPress: () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
              handleFocus();
            },
          },
          {
            text: 'Привязать',
            onPress: () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
              setCurrentLineId(newLine.id);

              navigation.navigate('SelectRefItem', {
                refName: 'good',
                fieldName: 'good',
              });

              handleFocus();
            },
          },
          { text: 'Пересканировать' },
        ]);

        setScanned(false);

        return;
      }
      setScanned(false);

      handleFocus();
    },
    [dispatch, doc, goodRemains, goods, id, isBlocked, lines, navigation],
  );

  const setScan = (brc: string) => {
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
    <>
      <View style={styles.container}>
        <InfoBlock
          colorLabel={getStatusColor(doc?.status || 'DRAFT')}
          title={'Сверка'}
          onPress={handleEditDocHead}
          disabled={isDelList || !['DRAFT', 'READY'].includes(doc.status)}
        >
          <>
            {!!doc.head.department && <MediumText>{doc.head.department.name}</MediumText>}
            <View style={styles.rowCenter}>
              <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
              {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
            </View>
            {doc.sentDate ? (
              <View style={styles.rowCenter}>
                <MediumText>
                  Отправлено: {getDateString(doc.sentDate)} {new Date(doc.sentDate).getHours()}:
                  {new Date(doc.sentDate).getMinutes()}:{new Date(doc.sentDate).getSeconds()}
                </MediumText>
              </View>
            ) : null}
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
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          extraData={[lines, delList, isBlocked]}
        />
        <SimpleDialog
          visible={visibleSendDialog}
          title={'Внимание!'}
          text={'Вы уверены, что хотите отправить документ?'}
          onCancel={() => setVisibleSendDialog(false)}
          onOk={handleSendDocument}
          okDisabled={loading}
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
