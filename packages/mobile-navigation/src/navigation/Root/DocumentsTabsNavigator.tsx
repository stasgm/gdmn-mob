import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/native';

import { documentsMock } from '@lib/mock';

import { navBackDrawer } from '@lib/mobile-ui';

import DocumentListScreen from '../../screens/Documents/DocumentListScreen';

import { TabsStackParams } from './types';

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  const types = useSelector((state) => state.references)?.list?.docTypes;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const handleAddDocument = () => {
    //
  };

  const handleLoad = () => {
    dispatch(documentActions.addDocuments(documentsMock));
  };

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
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]}>
      <TabsStack.Screen
        key="Documents"
        name="Documents"
        component={DocumentListScreen}
        initialParams={{ type: 'test' }}
        options={{
          title: 'Все',
          tabBarLabel: 'Все',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} />,
        }}
      />
      {types?.data.map((i) => (
        <TabsStack.Screen
          key={i.id}
          name={i.id}
          component={DocumentListScreen}
          initialParams={{ type: i.name as string }}
          options={{
            title: i.name as string,
            tabBarLabel: i.name as string,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} />,
          }}
        />
      ))}
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
