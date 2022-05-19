import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSelector } from '@lib/store';

const getDateString = (_date: string | Date) => {
  if (!_date) {
    return '-';
  }
  const date = new Date(_date);
  return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
    -2,
    3,
  )}.${date.getFullYear()}`;
};

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps & ICutsomProps;

export function DrawerContent({ onSync, syncing, ...props }: Props) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.auth.company);

  const syncDate = useSelector((state) => state.app.syncDate) as Date;

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
        {!!syncDate && (
          <View style={styles.updateSection}>
            <Caption style={styles.caption}>Дата синхронизации:</Caption>
            <Caption style={styles.caption}>
              {getDateString(syncDate)} {new Date(syncDate).toLocaleTimeString()}
            </Caption>
          </View>
        )}
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
    alignItems: 'flex-end',
  },
  systemInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
