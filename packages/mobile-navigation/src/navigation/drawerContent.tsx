import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useSelector } from '@lib/store';

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps<DrawerContentOptions> & ICutsomProps;

export function DrawerContent({ onSync, syncing, ...props }: Props) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.auth.company);
  // const loading = useSelector((state) => state.app.loading);

  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <>
      <View style={styles.userProfile}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity onPress={props.navigation.toggleDrawer}>
            <Avatar.Icon size={50} icon="badge-account-horizontal-outline" children={undefined} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Title style={styles.title}>{user?.firstName}</Title>
            <Title style={styles.title}>
              {!user?.firstName && !user?.lastName ? user?.name : user?.lastName || ''}
            </Title>
          </View>
        </View>
        <Caption style={styles.caption}>{company?.name || ''}</Caption>
      </View>
      <Divider />
      <DrawerContentScrollView {...props}>
        <Animated.View
          style={[
            styles.drawerContent,
            {
              backgroundColor: colors.surface,
              transform: [{ translateX }],
            },
          ]}
        >
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItemList {...props} />
          </Drawer.Section>
        </Animated.View>
      </DrawerContentScrollView>
      <View style={styles.systemInfo}>
        <TouchableOpacity onPress={onSync}>
          <Avatar.Icon size={50} icon="cloud-refresh" children={undefined} />
        </TouchableOpacity>
        <View style={styles.updateSection}>
          <Caption style={styles.caption}>
            Версия программы: {Constants.manifest?.extra?.appVesion}-{Constants.manifest?.extra?.buildVersion || 0}
          </Caption>
        </View>
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
    marginTop: 15,
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
  text: {
    padding: 2,
  },
  caption: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 14,
  },
  updateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  systemInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  drawerSection: {
    marginTop: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
