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
} from '@lib/mobile-ui';

import { IInventoryDocument, IInventoryLine } from '../../store/types';
import { DocumentsStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';

import { DocumentItem } from './components/DocumentItem';

export const DocumentViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<DocumentsStackParamList, 'DocumentView'>>();
  const id = useRoute<RouteProp<DocumentsStackParamList, 'DocumentView'>>().params?.id;
  console.log('id', id);
  const inventory = docSelectors.selectByDocType<IInventoryDocument>('order')?.find((e) => e.id === id);
  const dd = docSelectors.selectByDocType<IInventoryDocument>('order');

  console.log('inventory', dd);
  const isBlocked = inventory?.status !== 'DRAFT';

  const handleAddInventoryLine = useCallback(() => {
    navigation.navigate('SelectGroupItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditInventoryHead = useCallback(() => {
    navigation.navigate('DocumentEdit', { id });
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
        title: 'Удалить заявку',
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
            <MenuButton actionsMenu={actionsMenu} />
            <AddButton onPress={handleAddInventoryLine} />
          </View>
        ),
    });
  }, [navigation, handleAddInventoryLine, actionsMenu, isBlocked]);

  if (!inventory) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IInventoryLine }) => (
    <DocumentItem docId={inventory.id} item={item} readonly={isBlocked} />
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
