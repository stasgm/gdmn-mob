import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { documentActions, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
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
} from '@lib/mobile-ui';

import { getDateString, useSendDocs } from '@lib/mobile-app';

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

  const { colors } = useTheme();

  const [delList, setDelList] = useState<string[]>([]);

  const [del, setDel] = useState(false);
  const [isSend, setIsSend] = useState(false);

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);
  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;

  const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument;

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

  const handleUseSendDoc = useSendDocs([doc]);

  const handleSendDoc = useCallback(() => {
    setIsSend(true);
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          // setTimeout(() => {
          //   setIsSend(false);
          // }, 1);
          handleUseSendDoc();
        },
      },
      {
        text: 'Отмена',
        onPress: () => {
          setIsSend(false);
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
          {delList.length > 0 ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              <SendButton onPress={handleSendDoc} disabled={isSend} />
              <ScanButton onPress={handleDoScan} />
              <MenuButton actionsMenu={actionsMenu} />
            </>
          )}
        </View>
      ),
    [actionsMenu, delList.length, handleDeleteDocLine, handleDoScan, handleSendDoc, isBlocked, isSend],
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

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IMovementLine }) => {
    const checkedId = delList.find((i) => i === item.id) || '';

    return (
      <DocItem
        docId={doc.id}
        item={item}
        checked={checkedId ? true : false}
        onCheckItem={() => handelAddDeletelList(item.id, checkedId)}
        isDelList={delList.length > 0 ? true : false}
      />
    );
  };

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

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
      >
        <>
          <Text style={[styles.rowCenter, textStyle]}>
            {(doc.documentType.remainsField === 'fromContact'
              ? doc.head.fromContact?.name
              : doc.head.toContact?.name) || ''}
          </Text>
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
  );
};
