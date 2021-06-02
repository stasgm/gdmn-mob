import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { ItemSeparator, globalStyles as styles, DrawerButton } from '@lib/mobile-ui';

import { useScrollToTop } from '@react-navigation/native';

import { useSelector } from '../../store';
import { ILocation } from '../../store/geo/types';
import { geoActions } from '../../store/geo/actions';

const Item = ({ item }: { item: ILocation }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.item}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="bookmark" size={15} color="#FFF" />
      </View>
      <View style={styles.details}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.directionRow}>
            <Text style={styles.field}>{`${item.coords.latitude}, ${item.coords.longitude}`}</Text>
            <MaterialCommunityIcons name="map-marker-check-outline" size={15} />
          </View>
        </View>
      </View>
      {/*       <View style={styles.directionRow}>
        <Text style={styles.field}>{item.name}</Text>
      </View> */}
      {/* <TouchableOpacity style={[styles.icon]} onPress={() => dispatch(geoActions.deleteOne(item.id))}>
        <MaterialCommunityIcons name="delete" size={20} color={'#FFF'} />
      </TouchableOpacity> */}
    </View>
  );
};

const ListScreen = () => {
  // const dispatch = useDispatch();
  const navigation = useNavigation();
  // const { colors } = useTheme();

  const { list } = useSelector((state) => state.geo);

  const ref = useRef<FlatList<ILocation>>(null);
  useScrollToTop(ref);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: ILocation }) => <Item item={item} />;

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
