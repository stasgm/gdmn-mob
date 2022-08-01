import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, FlatList, Alert, ListRenderItem } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
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
} from '@lib/mobile-ui';

import { deleteSelectedLineItems, getDateString, getDelLineList, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { sleep } from '@lib/client-api';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { DocStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import { navBackButton } from '../../components/navigateOptions';
import { IGood } from '../../store/app/types';
import DocTotal from '../../components/DocTotal';

export const DocViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocView'>>();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;

  const doc = docSelectors.selectByDocId<IMovementDocument>(id);

  const docLineQuantity = doc?.lines?.reduce((sum, line) => sum + line.quantity, 0) || 0;
  const docLineSum = doc?.lines?.reduce((sum, line) => sum + line.quantity * (line?.price || 0), 0) || 0;

  const isBlocked = doc?.status !== 'DRAFT' || screenState !== 'idle';

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
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation]);

  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id, setDelList]);

  const handleUseSendDoc = useSendDocs([doc]);

  const handleSendDoc = useCallback(() => {
    setScreenState('sending');
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setTimeout(() => {
            setScreenState('idle');
          }, 10000);
          handleUseSendDoc();
        },
      },
      {
        text: 'Отмена',
        onPress: () => {
          setScreenState('idle');
        },
      },
    ]);
  }, [handleUseSendDoc]);

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

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocs} />
          ) : (
            <>
              <SendButton onPress={handleSendDoc} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, handleDeleteDocs, handleDoScan, handleSendDoc, isBlocked, isDelList],
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

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const renderItem: ListRenderItem<IMovementLine> = useCallback(
    ({ item }) => {
      const good = goods?.find((e) => e.id === item?.good.id);
      return (
        <ListItemLine
          key={item.id}
          onPress={() =>
            isDelList
              ? setDelList(getDelLineList(delList, item.id))
              : !isBlocked && navigation.navigate('DocLine', { mode: 1, docId: id, item })
          }
          onLongPress={() => setDelList(getDelLineList(delList, item.id))}
          checked={delList.includes(item.id)}
        >
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{item.good.name}</LargeText>
            <View style={styles.directionRow}>
              <MediumText>
                {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
              </MediumText>
            </View>
          </View>
        </ListItemLine>
      );
    },
    [goods, delList, isDelList, isBlocked, navigation, id],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>Удаление документа...</LargeText>
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
        title={doc?.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc?.status)}
        isBlocked={isBlocked}
      >
        <>
          <MediumText style={styles.rowCenter}>
            {(doc?.documentType.remainsField === 'fromContact'
              ? doc?.head.fromContact?.name
              : doc?.head.toContact?.name) || ''}
          </MediumText>
          <MediumText>{`№ ${doc?.number} от ${getDateString(doc?.documentDate)}`}</MediumText>
        </>
      </InfoBlock>
      <FlatList
        data={doc?.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
        ItemSeparatorComponent={ItemSeparator}
      />
      {doc?.lines.length ? (
        <DocTotal lineCount={doc?.lines?.length || 0} sum={docLineSum} quantity={docLineQuantity} />
      ) : null}
    </View>
  );
};
