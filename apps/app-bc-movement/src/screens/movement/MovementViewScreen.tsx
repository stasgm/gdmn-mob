import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors } from '@lib/store';
import { globalStyles as styles, InfoBlock, ItemSeparator, SubTitle, ScanButton, navBackButton } from '@lib/mobile-ui';

import { getDateString, keyExtractorByIndex } from '@lib/mobile-hooks';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { MovementStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { MovementItem } from '../../components/MovementItem';

export const MovementViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementView'>>();

  const id = useRoute<RouteProp<MovementStackParamList, 'MovementView'>>().params?.id;

  const bcMovement = docSelectors.selectByDocId<IMovementDocument>(id);

  const isBlocked = bcMovement?.status !== 'DRAFT';

  const handleEditMovementHead = useCallback(() => {
    navigation.navigate('MovementEdit', { id });
  }, [navigation, id]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: id });
  }, [navigation, id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <ScanButton onPress={handleDoScan} />
          </View>
        ),
    });
  }, [navigation, handleDoScan, isBlocked]);

  if (!bcMovement) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IMovementLine }) => (
    <SwipeLineItem docId={bcMovement.id} item={item} readonly={isBlocked} copy={false} edit={false}>
      <MovementItem item={item} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(bcMovement?.status || 'DRAFT')}
        title={`Откуда: ${bcMovement.head.fromPlace?.name} \nКуда: ${bcMovement.head.toPlace?.name}` || ''}
        onPress={handleEditMovementHead}
        disabled={!['DRAFT', 'READY'].includes(bcMovement.status)}
      >
        <View style={styles.rowCenter}>
          <Text>{`№ ${bcMovement.number} от ${getDateString(bcMovement.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={bcMovement.lines}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};
