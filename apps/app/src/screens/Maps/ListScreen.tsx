import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { FAB, useTheme } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ItemSeparator } from '@lib/mobile-ui/src/components';

import { useNavigation } from '@react-navigation/core';

import DrawerButton from '@lib/mobile-ui/src/components/AppBar/DrawerButton';

import { globalStyles as styles } from '@lib/mobile-ui';

import { useSelector } from '../../store';
import { ILocation } from '../../store/geo/types';
import { geoActions } from '../../store/geo/actions';

// import styles from './styles';

// import { AppState } from '../store';

const Item = ({ item }: { item: ILocation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  return (
    <View style={[styles.item, { backgroundColor: colors.background }]}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        </View>
        <Text
          style={[styles.number, styles.field, { color: colors.text }]}
        >{`Координаты: ${item.coords.latitude}, ${item.coords.longitude}`}</Text>
      </View>
      <TouchableOpacity style={[styles.icon]} onPress={() => dispatch(geoActions.deleteOne(item.id))}>
        <MaterialCommunityIcons name="delete" size={20} color={'#FFF'} />
      </TouchableOpacity>
    </View>
  );
};

const ListScreen = () => {
  const { list } = useSelector((state) => state.geo);
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleReset = () => {
    dispatch(geoActions.deleteAll());
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      //headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: ILocation }) => <Item item={item} />;

  const ref = useRef<FlatList<ILocation>>(null);

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
        // refreshing={loading}
        //refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
      />
      <FAB style={[styles.fabAdd, { backgroundColor: colors.primary }]} icon="dots-horizontal" onPress={handleReset} />
    </View>
  );
};

export default ListScreen;
