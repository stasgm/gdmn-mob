import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Text, View, FlatList, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
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
} from '@lib/mobile-ui';

import { generateId, getDateString, useSendDocs } from '@lib/mobile-app';

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

  const { colors } = useTheme();

  const [delList, setDelList] = useState<string[]>([]);

  const [del, setDel] = useState(false);
  const [isSend, setIsSend] = useState(false);

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);
  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

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
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setDel(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);

    // dispatch(documentActions.removeDocument(id));
    // navigation.goBack();
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
    setIsSend(true);
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: () => {
          setTimeout(() => {
            setIsSend(false);
          }, 10000);
          handleSendDoc();
        },
      },
      {
        text: 'Отмена',
        onPress: () => {
          setIsSend(false);
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
      !isBlocked && (
        <View style={styles.buttons}>
          {delList.length > 0 ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              <SendButton onPress={handleSendScanDoc} disabled={isSend} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, delList.length, handleDeleteDocLine, handleDoScan, handleSendScanDoc, isBlocked, isSend],
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

  if (del) {
    return (
      <View style={styles.container}>
        <View style={styles.deleteView}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colorStyle} />
        </View>
      </View>
    );
  } else {
    if (!doc) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  const renderItem = ({ item, index }: { item: IScanLine; index: number }) => {
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
  };

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
          <>
            {/* <Text style={[styles.rowCenter, textStyle]}>{doc?.head?.department?.name || ''}</Text> */}
            <View style={styles.rowCenter}>
              <Text style={textStyle}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</Text>

              {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
            </View>
          </>
        </InfoBlock>
        <FlatList
          data={doc.lines}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          scrollEventThrottle={400}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </>
  );
};
