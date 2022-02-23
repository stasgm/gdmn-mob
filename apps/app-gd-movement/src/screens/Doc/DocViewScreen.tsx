import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { IDocDocument, IDocLine, IInventoryDocument, IInventoryLine } from '../../store/types';
import { DocStackParamList, InventoryStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { DocItem } from '../../components/DocItem';

export const DocViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocView'>>();

  const id = useRoute<RouteProp<DocStackParamList, 'DocView'>>().params?.id;

  // const inventory = docSelectors.selectByDocType<IInventoryDocument>('inventory')?

  const inventory = useSelector((state) => state.documents.list).find((e) => e.id === id) as IDocDocument | undefined;

  const isBlocked = inventory?.status !== 'DRAFT';

  const handleAddInventoryLine = useCallback(() => {
    navigation.navigate('SelectRemainsItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditInventoryHead = useCallback(() => {
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
        onPress: handleAddInventoryLine,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditInventoryHead,
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
  }, [showActionSheet, handleAddInventoryLine, handleDelete, handleEditInventoryHead]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <ScanButton onPress={handleDoScan} />
            <MenuButton actionsMenu={actionsMenu} />
          </View>
        ),
    });
  }, [navigation, handleAddInventoryLine, actionsMenu, handleDoScan, isBlocked]);

  if (!inventory) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IDocLine }) => (
    <SwipeLineItem docId={inventory.id} item={item} readonly={isBlocked} copy={false} routeName="DocLine">
      <DocItem docId={inventory.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(inventory?.status || 'DRAFT')}
        title={inventory.head.toDepartment?.name || ''}
        onPress={handleEditInventoryHead}
        disabled={!['DRAFT', 'READY'].includes(inventory.status)}
      >
        <View style={styles.rowCenter}>
          <Text>{`№ ${inventory.number} от ${getDateString(inventory.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={inventory.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};
