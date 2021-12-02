import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, documentActions, useDispatch } from '@lib/store';
import {
  AddButton,
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { IInventoryDocument, IInventoryLine } from '../../store/types';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';

import { InventoryItem } from './components/InventoryItem';

export const InventoryViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryView'>>();

  const id = useRoute<RouteProp<InventorysStackParamList, 'InventoryView'>>().params?.id;
  const inventory = docSelectors.selectByDocType<IInventoryDocument>('order')?.find((e) => e.id === id);

  const isBlocked = inventory?.status !== 'DRAFT';

  const handleAddInventoryLine = useCallback(() => {
    navigation.navigate('SelectGoodItem', {
      docId: id,
    });
  }, [navigation, id]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleScannerGood = useCallback(() => {}, []); //Scan

  const handleEditInventoryHead = useCallback(() => {
    navigation.navigate('InventoryEdit', { id });
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
            <ScanButton onPress={handleScannerGood} />
            <MenuButton actionsMenu={actionsMenu} />
            <AddButton onPress={handleAddInventoryLine} />
          </View>
        ),
    });
  }, [navigation, handleAddInventoryLine, handleScannerGood, actionsMenu, isBlocked]);

  if (!inventory) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IInventoryLine }) => (
    <InventoryItem docId={inventory.id} item={item} readonly={isBlocked} />
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(inventory?.status || 'DRAFT')}
        title={inventory.head.department?.name || ''}
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
