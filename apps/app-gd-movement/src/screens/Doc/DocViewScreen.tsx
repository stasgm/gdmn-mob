import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { documentActions, useDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { DocStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { DocItem } from '../../components/DocItem';
import { navBackButton } from '../../components/navigateOptions';

export const DocViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocView'>>();

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;

  const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument | undefined;

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

    dispatch(documentActions.removeDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

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
          <ScanButton onPress={handleDoScan} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleDoScan, isBlocked],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => navBackButton,
      headerRight: () => renderRight,
    });
  }, [navigation, renderRight]);

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IMovementLine }) => (
    <SwipeLineItem docId={doc.id} item={item} readonly={isBlocked} copy={false} routeName="DocLine">
      <DocItem docId={doc.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
      >
        <>
          <Text style={styles.rowCenter}>
            {(doc.documentType.remainsField === 'fromContact'
              ? doc.head.fromContact?.name
              : doc.head.toContact?.name) || ''}
          </Text>
          <View style={styles.rowCenter}>
            <Text>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</Text>

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
