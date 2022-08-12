import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Modal, TextInput, Alert, ListRenderItem } from 'react-native';
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
  ScanButton,
  DeleteButton,
  CloseButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  ListItemLine,
} from '@lib/mobile-ui';

import {
  deleteSelectedLineItems,
  generateId,
  getDateString,
  getDelLineList,
  keyExtractor,
  useSendDocs,
} from '@lib/mobile-app';

import { sleep } from '@lib/client-api';

import { IScanDocument, IScanLine } from '../../store/types';
import { ScanStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import { navBackButton } from '../../components/navigateOptions';
import { ScanDataMatrix, ScanDataMatrixReader } from '../../components';

export const ScanViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const navigation = useNavigation<StackNavigationProp<ScanStackParamList, 'ScanView'>>();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

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

  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id, setDelList]);

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
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocs} />
          ) : (
            <>
              <SendButton onPress={handleSendScanDoc} disabled={screenState !== 'idle'} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, handleDeleteDocs, handleDoScan, handleSendScanDoc, isBlocked, isDelList, screenState],
  );

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isBlocked, isDelList, setDelList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: isDelList ? `Выделено позиций: ${delList.length}` : 'Документ',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IScanLine> = ({ item, index }) => (
    <ListItemLine
      key={item.id}
      {...item}
      onPress={() => (isDelList ? setDelList(getDelLineList(delList, item.id)) : undefined)}
      onLongPress={() => setDelList(getDelLineList(delList, item.id))}
      checked={delList.includes(item.id)}
    >
      <View style={styles.details}>
        <LargeText style={styles.textBold}>Сканирование {(index + 1)?.toString()}</LargeText>

        {item.barcode?.length && item.barcode?.length > 25 ? (
          <MediumText>{item.barcode?.slice(0, 25)}...</MediumText>
        ) : (
          <MediumText>{item.barcode}</MediumText>
        )}
      </View>
    </ListItemLine>
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
    <>
      <Modal animationType="slide" visible={doScanned}>
        {isScanerReader ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal>
      <View style={styles.container}>
        <InfoBlock
          colorLabel={getStatusColor(doc?.status || 'DRAFT')}
          title={doc?.head?.department?.name || ''}
          onPress={handleEditDocHead}
          disabled={delList.length > 0 || !['DRAFT', 'READY'].includes(doc.status)}
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
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </>
  );
};
