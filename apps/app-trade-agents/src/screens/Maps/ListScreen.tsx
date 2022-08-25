import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, TouchableHighlight, View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  ItemSeparator,
  globalStyles as styles,
  AppScreen,
  EmptyList,
  MediumText,
  LargeText,
  navBackDrawer,
} from '@lib/mobile-ui';

import { keyExtractor } from '@lib/mobile-app';

import { useDispatch, useSelector } from '../../store';
import { ILocation } from '../../store/geo/types';
import { geoActions } from '../../store/geo/actions';

import localStyles from './styles';

const Item = ({ item, onPress, selected }: { item: ILocation; onPress: () => void; selected: boolean }) => {
  const viewStyle = useMemo(
    () => [
      styles.icon,
      item.number === 0 ? localStyles.myLocationMark : selected ? localStyles.selectedMark : localStyles.mark,
    ],
    [item.number, selected],
  );

  return (
    <TouchableHighlight onPress={onPress} style={styles.flexDirectionRow} activeOpacity={0.4} underlayColor="#DDDDDD">
      <>
        <View style={styles.item}>
          <View style={viewStyle}>
            <MediumText style={styles.lightText}>{item.number}</MediumText>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <LargeText style={styles.textBold}>{item.name}</LargeText>
          </View>
          <View style={styles.flexDirectionRow}>
            <MaterialCommunityIcons name="map-marker-check-outline" size={15} />
            <MediumText>{`${item.coords.latitude}, ${item.coords.longitude}`}</MediumText>
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};

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
      headerLeft: navBackDrawer,
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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};

export default ListScreen;
