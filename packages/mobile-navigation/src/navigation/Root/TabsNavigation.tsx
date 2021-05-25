import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSelector } from '@lib/store';

import DocumentsScreen from '../../screens/Documents/DocumentsScreen';

import { TabsStackParams } from './types';

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  const types = useSelector((state) => state.references).list.docTypes;

  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]} /* initialRouteName=""*/>
      {types.data.slice(2).map((typeDoc) => (
        <TabsStack.Screen
          key={typeDoc.id}
          name={typeDoc.id}
          component={DocumentsScreen}
          initialParams={{ type: typeDoc.name as string }}
          options={{
            title: (typeDoc.name || '') as string,
            tabBarLabel: (typeDoc.name || '') as string,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} />,
          }}
        />
      ))}
      {/*<TabsStack.Screen
        key="OtherTypes"
        name="OtherTypes"
        component={DocumentsScreen}
        //initialParams={{ types: ['Приход', 'Инвенторизация'] }}
        options={{
          title: 'Другие',
          tabBarLabel: 'Другие',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="dots-horizontal" size={24} color={color} />,
        }}
      />*/}
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
