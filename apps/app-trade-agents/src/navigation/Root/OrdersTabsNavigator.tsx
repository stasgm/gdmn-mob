import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { documentActions, useDispatch } from '@lib/store';

import { MenuButton, DrawerButton, AddButton } from '@lib/mobile-ui/src/components/AppBar';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/native';

import OrderListScreen from '../../screens/Orders/OrderListScreen';

import { orderMock } from '../../store/docs/mock';

import OrderViewScreen from '../../screens/Orders/OrderViewScreen';

import { OrdersTabStackParamList } from './types';

const TabsStack = createMaterialBottomTabNavigator<OrdersTabStackParamList>();

const OrdersTabsNavigator = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleAddDocument = useCallback(() => {
    console.log('Добавление документа');
  }, []);

  const handleLoad = useCallback(() => {
    dispatch(documentActions.addDocuments(orderMock));
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
      headerRight: () => {
        return (
          <View style={styles.rightButtons}>
            <AddButton onPress={handleAddDocument} />
            <MenuButton actionsMenu={actionsMenu} />
          </View>
        );
      },
    });
  }, [actionsMenu, handleAddDocument, navigation]);

  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]}>
      <TabsStack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{
          title: 'Новые',
          tabBarLabel: 'Новые',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document-outline" size={24} color={color} />,
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
      <TabsStack.Screen name="OrderView" component={OrderViewScreen} />
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  rightButtons: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default OrdersTabsNavigator;
