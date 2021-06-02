import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { RouteProp, useRoute, useScrollToTop } from '@react-navigation/native';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { globalStyles as styles, ItemSeparator, SubTitle, useActionSheet, MenuButton } from '@lib/mobile-ui';
import { useDispatch, documentActions, docSelectors } from '@lib/store';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IRouteDocument, IRouteLine } from '../../store/docs/types';

import RouteItem from './components/RouteItem';

const RouteViewScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;
  const list = (docSelectors.selectByDocType('route') as IRouteDocument[])?.find((e) => e.id === id);

  const ref = useRef<FlatList<IRouteLine>>(null);
  useScrollToTop(ref);

  const handleDelete = useCallback(() => {
    dispatch(documentActions.clearError());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Распечатать',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleDelete, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  if (!list) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IRouteLine }) => <RouteItem key={item.id} item={item} routeId={list.id} />;

  return (
    <View style={styles.container}>
      <SubTitle style={styles.title}>{list.documentDate}</SubTitle>
      <Divider />
      <FlatList
        ref={ref}
        data={list.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default RouteViewScreen;
