import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
  CloseButton,
  DeleteButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
} from '@lib/mobile-ui';

import { getDateString, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { sleep } from '@lib/client-api';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { DocStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import { DocItem } from '../../components/DocItem';
import { navBackButton } from '../../components/navigateOptions';

export const DocViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocView'>>();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

  const [delList, setDelList] = useState<string[]>([]);

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;

  // const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument;

  const doc = docSelectors.selectByDocId<IMovementDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

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

  const handelAddDeletelList = useCallback(
    (lineId: string, checkedId: string) => {
      if (checkedId) {
        const newList = delList.filter((i) => i !== checkedId);
        setDelList(newList);
      } else {
        setDelList([...delList, lineId]);
      }
    },
    [delList],
  );

  const handleDeleteDocLine = useCallback(() => {
    Alert.alert('Вы уверены, что хотите удалить позиции документа?', '', [
      {
        text: 'Да',
        onPress: () => {
          for (const item of delList) {
            dispatch(documentActions.removeDocumentLine({ docId: id, lineId: item }));
          }
          setDelList([]);
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [delList, dispatch, id]);

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
      !isBlocked &&
      screenState !== 'deleting' && (
        <View style={styles.buttons} pointerEvents={screenState !== 'idle' ? 'none' : 'auto'}>
          {delList.length > 0 ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              <SendButton onPress={handleSendDoc} disabled={screenState !== 'idle'} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, delList.length, handleDeleteDocLine, handleDoScan, handleSendDoc, isBlocked, screenState],
  );

  const renderLeft = useCallback(
    () => !isBlocked && delList.length > 0 && <CloseButton onPress={() => setDelList([])} />,
    [delList.length, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: delList.length > 0 ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: delList.length > 0 ? `Выделено позиций: ${delList.length}` : 'Документ',
    });
  }, [delList.length, navigation, renderLeft, renderRight]);

  const handlePressDocLine = useCallback(
    (item: IMovementLine) => !isBlocked && navigation.navigate('DocLine', { mode: 1, docId: id, item }),
    [id, isBlocked, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IMovementLine }) => {
      const checkedId = delList.find((i) => i === item.id) || '';

      return (
        <DocItem
          item={item}
          checked={checkedId ? true : false}
          onPress={() => handlePressDocLine(item)}
          onLongPress={() => handelAddDeletelList(item.id, checkedId)}
          isDelList={delList.length > 0 ? true : false}
        />
      );
    },
    [delList, handelAddDeletelList, handlePressDocLine],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <SubTitle style={styles.title}>
            {screenState === 'deleting'
              ? 'Удаление документа...'
              : // : screenState === 'sending'
                // ? 'Отправка документа...'
                ''}
          </SubTitle>
          <AppActivityIndicator />
        </View>
      </View>
    );
  }
  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
      >
        <>
          <MediumText style={styles.rowCenter}>
            {(doc.documentType.remainsField === 'fromContact'
              ? doc.head.fromContact?.name
              : doc.head.toContact?.name) || ''}
          </MediumText>
          <View style={styles.rowCenter}>
            <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>

            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </>
      </InfoBlock>
      <FlatList
        data={doc.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
        // scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};
