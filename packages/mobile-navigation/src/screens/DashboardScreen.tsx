import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { MediumText, AppScreen, navBackDrawer } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DashboardStackParamList } from '../navigation/Root/types';
import { INavItem, ScreenParams } from '../navigation/types';
import { dashboardColors } from '../constants';

const DashboardScreen = ({ items }: { items: INavItem[] }) => {
  const { colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<DashboardStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
    });
  }, []);

  const handleDocumentPress = (routeName: string, params?: ScreenParams) => {
    navigation.navigate(routeName, params);
  };

  const titleSize = { fontSize: items.length > 8 ? 14 : 16 };

  return (
    <AppScreen>
      <View style={styles.container}>
        {items
          .filter((item) => item.showInDashboard)
          .sort((a, b) => (a.sortNumber || 0) - (b.sortNumber || 0))
          .map((item, xid) => (
            <TouchableOpacity
              key={item.name}
              style={[{ backgroundColor: item.color || dashboardColors[xid] || colors.primary }, styles.item]}
              onPress={() =>
                handleDocumentPress(item.dashboardScreenName || `${item.name}Edit`, item.dashboardScreenParams)
              }
            >
              <MaterialCommunityIcons name={item.icon} size={items.length > 8 ? 38 : 50} color={'#FFF'} />
              <MediumText style={[styles.title, titleSize]}>{item.title}</MediumText>
            </TouchableOpacity>
          ))}
      </View>
    </AppScreen>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignContent: 'stretch',
  },
  item: {
    width: '48%',
    paddingVertical: 4,
    alignItems: 'center',
    margin: '1%',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    // fontSize: 16,
  },
});
