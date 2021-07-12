import React, { useCallback, useLayoutEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { ItemSeparator, globalStyles as styles, DrawerButton } from '@lib/mobile-ui';

import { useScrollToTop } from '@react-navigation/native';

import { useDispatch, useSelector } from '../../store';
import { ILocation } from '../../store/geo/types';
import { geoActions } from '../../store/geo/actions';

import localStyles from './styles';

const Item = ({ item, onPress, selected }: { item: ILocation; onPress: () => void; selected: boolean }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View
          style={[
            styles.icon,
            item.number === 0 ? localStyles.myLocationMark : selected ? localStyles.selectedMark : localStyles.mark,
          ]}
        >
          <Text style={styles.lightText}>{item.number}</Text>
        </View>
        {/*         <View style={styles.icon}>
          <MaterialCommunityIcons name="bookmark" size={15} color="#FFF" />
        </View> */}
        <View style={styles.details}>
          <View style={styles.rowCenter}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View style={styles.flexDirectionRow}>
            <MaterialCommunityIcons name="map-marker-check-outline" size={15} />
            <Text style={styles.field}>{`${item.coords.latitude}, ${item.coords.longitude}`}</Text>
          </View>
        </View>
        {/*       <View style={styles.directionRow}>
        <Text style={styles.field}>{item.name}</Text>
      </View> */}
        {/* <TouchableOpacity style={[styles.icon]} onPress={() => dispatch(geoActions.deleteOne(item.id))}>
        <MaterialCommunityIcons name="delete" size={20} color={'#FFF'} />
      </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

const ListScreen = () => {
  const navigation = useNavigation();
  // const { colors } = useTheme();
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
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
      />
    </View>
  );
};

export default ListScreen;
