import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ItemSeparator, globalStyles as styles, DrawerButton, AppScreen } from '@lib/mobile-ui';

import { useDispatch, useSelector } from '../../store';
import { ILocation } from '../../store/geo/types';
import { geoActions } from '../../store/geo/actions';

import localStyles from './styles';

const Item = ({ item, onPress, selected }: { item: ILocation; onPress: () => void; selected: boolean }) => (
  <TouchableHighlight onPress={onPress} style={styles.flexDirectionRow} activeOpacity={0.4} underlayColor="#DDDDDD">
    <>
      <View style={styles.item}>
        <View
          style={[
            styles.icon,
            item.number === 0 ? localStyles.myLocationMark : selected ? localStyles.selectedMark : localStyles.mark,
          ]}
        >
          <Text style={styles.lightText}>{item.number}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.flexDirectionRow}>
          <MaterialCommunityIcons name="map-marker-check-outline" size={15} />
          <Text style={styles.field}>{`${item.coords.latitude}, ${item.coords.longitude}`}</Text>
        </View>
      </View>
    </>
  </TouchableHighlight>
);

const ListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const list = useSelector((state) => state.geo)?.list?.sort((a, b) => a.number - b.number);
  const currentPoint = useSelector((state) => state.geo.currentPoint);

  const setCurrentPoint = useCallback((point: ILocation) => dispatch(geoActions.setCurrentPoint(point)), [dispatch]);

  const ref = useRef<FlatList<ILocation>>(null);
  useScrollToTop(ref);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: ILocation }) => (
    <Item item={item} onPress={() => setCurrentPoint(item)} selected={item.id === currentPoint?.id} />
  );

  return (
    <AppScreen>
      <FlatList
        ref={ref}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
      />
    </AppScreen>
  );
};

export default ListScreen;
