import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { RouteProp, useRoute, useScrollToTop } from '@react-navigation/native';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import {
  globalStyles as styles,
  ItemSeparator,
  SubTitle,
  useActionSheet,
  MenuButton,
  BackButton,
  AppScreen,
} from '@lib/mobile-ui';
import { useDispatch, documentActions, docSelectors } from '@lib/store';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IRouteDocument, IRouteLine } from '../../store/docs/types';

import RouteItem from './components/RouteItem';
import { getDateString } from '../../utils/helpers';

const RouteViewScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;
  const route = (docSelectors.selectByDocType('route') as unknown as IRouteDocument[])?.find((e) => e.id === id);

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
      headerLeft: () => <BackButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  if (!route) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IRouteLine }) => <RouteItem item={item} routeId={route.id} />;

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{getDateString(route.documentDate)}</SubTitle>
      <Divider />
      <FlatList
        ref={ref}
        data={route.lines.sort((a, b) => a.ordNumber - b.ordNumber)}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </AppScreen>
  );
};

export default RouteViewScreen;
