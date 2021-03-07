/* eslint-disable react-native/no-raw-text */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

type Props = DrawerContentComponentProps<DrawerContentOptions>;

export function DrawerContent({ progress, navigation }: Props) {
  const paperTheme = useTheme();

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <>
      <View style={styles.userProfile}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
          >
            <Avatar.Icon size={50} icon="badge-account-horizontal-outline" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Title style={styles.title}>Шляхтич</Title>
            <Title style={styles.title}>Станислав</Title>
          </View>
        </View>
        <Caption style={styles.caption}>ОДО "Золотые программы"</Caption>
      </View>
      <Divider />
      <DrawerContentScrollView {...navigation}>
        <Animated.View
          style={[
            styles.drawerContent,
            {
              backgroundColor: paperTheme.colors.surface,
              transform: [{ translateX }],
            },
          ]}
        >
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
              )}
              label="Дашборд"
              onPress={() => navigation.navigate('Dashboard')}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="file-document-outline" color={color} size={size} />
              )}
              label="Документы"
              onPress={() => navigation.navigate('Documents')}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="book-multiple-outline" color={color} size={size} />
              )}
              label="Справочники"
              onPress={() => navigation.navigate('References')}
            />
            <DrawerItem
              icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
              label="Настройки"
              onPress={() => navigation.navigate('Settings')}
            />
          </Drawer.Section>
        </Animated.View>
      </DrawerContentScrollView>
      <View style={styles.systemInfo}>
        <Caption style={styles.caption}>Версия программы: 0.0.1</Caption>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfile: {
    flexDirection: 'column',
  },
  profileInfo: {
    paddingLeft: 10,
    paddingTop: 0,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  caption: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 14,
  },
  systemInfo: {
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingBottom: 5,
  },
  drawerSection: {
    marginTop: 0,
  },
});
