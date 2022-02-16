import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, documentActions, useDispatch } from '@lib/store';
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

import { IInventoryDocument, IInventoryLine, IMovementDocument } from '../../store/types';
import { InventoryStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { MovementItem } from '../../components/MovementItem';

export const MovementViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<InventoryStackParamList, 'MovementView'>>();

  const id = useRoute<RouteProp<InventoryStackParamList, 'MovementView'>>().params?.id;

  const inventory = docSelectors.selectByDocType<IMovementDocument>('inventory')?.find((e) => e.id === id);

  const isBlocked = inventory?.status !== 'DRAFT';

  const handleEditInventoryHead = useCallback(() => {
    navigation.navigate('MovementEdit', { id });
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <ScanButton onPress={handleDoScan} />
          </View>
        ),
    });
  }, [navigation, handleDoScan, isBlocked]);

  if (!inventory) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IInventoryLine }) => (
    <SwipeLineItem docId={inventory.id} item={item} readonly={isBlocked} copy={false} edit={false}>
      <MovementItem docId={inventory.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  console.log('inventory.lines', inventory.lines);

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(inventory?.status || 'DRAFT')}
        title={`№ ${inventory.number} от ${getDateString(inventory.documentDate)}` || ''}
        onPress={handleEditInventoryHead}
        disabled={!['DRAFT', 'READY'].includes(inventory.status)}
      >
        <View style={localStyles.column}>
          {/* {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null} */}
          <View style={styles.rowCenter}>
            {/* <Text>{`№ ${inventory.number} от ${getDateString(inventory.documentDate)}`}</Text> */}
            <Text>{`Откуда: ${inventory.head.departmentFrom?.name || ''}`}</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text>{`Куда: ${inventory.head.departmentTo?.name || ''}`}</Text>
          </View>
          {/* <Text>1234</Text> */}
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

const localStyles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    width: '80%',
  },
});
