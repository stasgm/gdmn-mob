import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import DrawerButton from '@lib/mobile-ui/src/components/AppBar/DrawerButton';
import MenuButton from '@lib/mobile-ui/src/components/AppBar/MenuButton';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/native';

import { documentsMock } from '@lib/mock';

import OrderListScreen from '../../screens/Orders/OrderListScreen';

import { OrdersTabStackParamList } from './types';

const TabsStack = createMaterialBottomTabNavigator<OrdersTabStackParamList>();

const TabsNavigator = () => {
  const types = useSelector((state) => state.references)?.list?.docTypes;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleAddDocument = useCallback(() => {
    console.log('types', JSON.stringify(types?.data));
  }, [types?.data]);

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(documentsMock));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(documentActions.init());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить документ',
        onPress: handleAddDocument,
      },
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleReset,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleAddDocument, handleLoad, handleReset, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]}>
      <TabsStack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{
          title: 'Новые',
          tabBarLabel: 'Новые',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} />,
        }}
      />
      <TabsStack.Screen
        name="OrderArchList"
        component={OrderListScreen}
        options={{
          title: 'Архив',
          tabBarLabel: 'Архив',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="archive-outline" size={24} color={color} />,
        }}
      />
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
