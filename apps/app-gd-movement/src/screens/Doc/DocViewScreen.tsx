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

import { IDocumentType, INamedEntity, ISettingsOption, ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { DocStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS, unknownGood } from '../../utils/constants';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';

import { getRemGoodByContact } from '../../utils/helpers';

import DocTotal from './components/DocTotal';

export const DocViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocView'>>();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IMovementDocument>(id);

  const loading = useSelector((state) => state.app.loading);

  const docLineQuantity = doc?.lines?.reduce((sum, line) => sum + line.quantity, 0) || 0;
  const docLineSum = doc?.lines?.reduce((sum, line) => sum + line.quantity * (line?.price || 0), 0) || 0;

  const lines = doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  const ref = useRef<TextInput>(null);

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
  const handleAddDocLine = useCallback(() => {
    navigation.navigate('SelectRemainsItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('DocEdit', { id });
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
        title: 'Добавить товар',
        onPress: handleAddDocLine,
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
  }, [showActionSheet, handleAddDocLine, handleDelete, handleEditDocHead]);

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
                <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
              {!isScanerReader && <ScanButton onPress={handleDoScan} disabled={screenState !== 'idle'} />}
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

  const renderItem = ({ item }: { item: IMovementLine }) => {
    const good = goods?.find((e) => e.id === item?.good.id);
    return (
      <ListItemLine
        key={item.id}
        onPress={() =>
          isDelList
            ? setDelList(getDelLineList(delList, item.id))
            : !isBlocked && navigation.navigate('DocLine', { mode: 1, docId: id, item })
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

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;
  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === doc?.documentType.id),
    [doc?.documentType.id, documentTypes],
  );

  const contactId = useMemo(
    () => (documentType?.remainsField === 'fromContact' ? doc?.head?.fromContact?.id : doc?.head?.toContact?.id),
    [doc?.head?.fromContact?.id, doc?.head?.toContact?.id, documentType?.remainsField],
  );

  const [goodRemains] = useState<IMGoodData<IMGoodRemain>>(() =>
    contactId ? getRemGoodByContact(goods, remains[contactId], documentType?.isRemains) : {},
  );

  const settings = useSelector((state) => state.settings?.data);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>)?.data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>)?.data || 0;
  const isInputQuantity = settings.quantityInput?.data;

  const [key, setKey] = useState(1);

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (!brc) {
        return;
      }

      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      let scannedObject: IMovementLine;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem =
          goodRemains[brc] || (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });
        // Находим товар из модели остатков по баркоду, если баркод не найден, то
        //   если выбор из остатков, то undefined,
        //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа

        if (!remItem) {
          Alert.alert('Внимание!', 'Товар не найден', [
            {
              text: 'ОК',
            },
          ]);

          return;
        }

        scannedObject = {
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          quantity: isInputQuantity ? 1 : 0,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
          sortOrder: (lines?.length || 0) + 1,
        };
      } else {
        charFrom = charTo;
        charTo = charFrom + weightSettingsCountCode;
        const code = Number(brc.substring(charFrom, charTo)).toString();

        charFrom = charTo;
        charTo = charFrom + weightSettingsCountWeight;

        const qty = Number(brc.substring(charFrom, charTo)) / 1000;

        const remItem =
          Object.values(goodRemains)?.find((item: IMGoodRemain) => item.good.weightCode === code) ||
          (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });

        if (!remItem) {
          Alert.alert('Внимание!', 'Товар не найден', [
            {
              text: 'ОК',
            },
          ]);
          return;
        }

        scannedObject = {
          good: { id: remItem.good.id, name: remItem.good.name } as INamedEntity,
          id: generateId(),
          quantity: qty,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
          sortOrder: (lines?.length || 0) + 1,
        };
      }

      navigation.navigate('DocLine', {
        mode: 0,
        docId: id,
        item: scannedObject,
      });
    },

    [
      doc,
      documentType?.isRemains,
      goodRemains,
      id,
      isInputQuantity,
      lines?.length,
      navigation,
      weightSettingsCountCode,
      weightSettingsCountWeight,
      weightSettingsWeightCode.data,
    ],
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
        onPress={handleEditDocHead}
        disabled={delList.length > 0 || !['DRAFT', 'READY'].includes(doc.status)}
        isBlocked={isBlocked}
      >
        <>
          {doc.head.fromContact && (
            <MediumText
              style={styles.rowCenter}
            >{`${doc.documentType.fromDescription}: ${doc.head.fromContact?.name}`}</MediumText>
          )}
          {doc.head.toContact && (
            <MediumText
              style={styles.rowCenter}
            >{`${doc.documentType.toDescription}: ${doc.head.toContact?.name}`}</MediumText>
          )}
          <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
        </>
      </InfoBlock>
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
        data={doc.lines}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        extraData={[goods, delList, isDelList, isBlocked, navigation, id]}
      />
      {doc.lines.length ? (
        <DocTotal lineCount={doc.lines?.length || 0} sum={docLineSum} quantity={docLineQuantity} />
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
