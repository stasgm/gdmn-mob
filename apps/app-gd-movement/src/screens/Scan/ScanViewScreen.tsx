import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, FlatList, Modal, TextInput, Alert } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
  DeleteButton,
  CloseButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
} from '@lib/mobile-ui';

import { generateId, getDateString, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { sleep } from '@lib/client-api';

import { IScanDocument, IScanLine } from '../../store/types';
import { ScanStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import { navBackButton } from '../../components/navigateOptions';
import { ScanDataMatrix, ScanDataMatrixReader } from '../../components';

import { ScanItem } from './components/ScanItem';

export const ScanViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const navigation = useNavigation<StackNavigationProp<ScanStackParamList, 'ScanView'>>();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

  const [delList, setDelList] = useState<string[]>([]);

  const [doScanned, setDoScanned] = useState(false);

  const id = useRoute<RouteProp<ScanStackParamList, 'ScanView'>>().params?.id;

  const doc = docSelectors.selectByDocId<IScanDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

  const currRef = useRef<TextInput>(null);
  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), ONE_SECOND_IN_MS);
  }, []);

  const handleEIDScanned = useCallback(
    (data: string) => {
      const line: IScanLine = { id: generateId(), barcode: data };
      dispatch(documentActions.addDocumentLine({ docId: id, line }));
    },
    [dispatch, id],
  );

  const handleDoScan = useCallback(() => {
    setDoScanned(true);
  }, []);

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('ScanEdit', { id });
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

  const handleSendDoc = useSendDocs([doc]);

  const handleSendScanDoc = useCallback(() => {
    setScreenState('sending');
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: () => {
          setTimeout(() => {
            setScreenState('idle');
          }, 10000);
          handleSendDoc();
        },
      },
      {
        text: 'Отмена',
        onPress: () => {
          setScreenState('idle');
        },
      },
    ]);
  }, [handleSendDoc]);

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
      },
    ]);
  }, [showActionSheet, handleDelete, handleEditDocHead]);

  const renderRight = useCallback(
    () =>
      !isBlocked &&
      screenState !== 'deleting' && (
        <View style={styles.buttons} pointerEvents={screenState !== 'idle' ? 'none' : 'auto'}>
          {delList.length > 0 ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              <SendButton onPress={handleSendScanDoc} disabled={screenState !== 'idle'} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, delList.length, handleDeleteDocLine, handleDoScan, handleSendScanDoc, isBlocked, screenState],
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

  const renderItem = useCallback(
    ({ item, index }: { item: IScanLine; index: number }) => {
      const checkedId = delList.find((i) => i === item.id) || '';
      return (
        <ScanItem
          readonly={isBlocked}
          index={index}
          checked={checkedId ? true : false}
          onCheckItem={() => handelAddDeletelList(item.id, checkedId)}
          isDelList={delList.length > 0 ? true : false}
        />
      );
    },
    [delList, handelAddDeletelList, isBlocked],
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
    <>
      <Modal animationType="slide" visible={doScanned}>
        {isScanerReader ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal>
      <View style={[styles.container]}>
        <InfoBlock
          colorLabel={getStatusColor(doc?.status || 'DRAFT')}
          title={doc?.head?.department?.name || ''}
          onPress={handleEditDocHead}
          disabled={!['DRAFT', 'READY'].includes(doc.status)}
        >
          <View style={styles.rowCenter}>
            <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>

            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
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
    </>
  );
};
