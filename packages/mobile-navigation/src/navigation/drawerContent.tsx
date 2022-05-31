import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSelector } from '@lib/store';
import { useTheme } from '@react-navigation/native';
import { PrimeButton } from '@lib/mobile-ui';

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
            <Avatar.Icon
              size={50}
              icon="badge-account-horizontal-outline"
              style={{ backgroundColor: colors.primary }}
            />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Title style={styles.title}>{user?.firstName}</Title>
            <Title style={styles.title}>
              {!user?.firstName && !user?.lastName ? user?.name : user?.lastName || ''}
            </Title>
          </View>
        </View>
        <Caption style={[styles.caption, { color: colors.text }]}>{company?.name || ''}</Caption>
      </View>
      <Divider />
      <DrawerContentScrollView {...props}>
        <Animated.View
          style={[
            styles.drawerContent,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItemList {...props} />
          </Drawer.Section>
        </Animated.View>
      </DrawerContentScrollView>
      <PrimeButton icon="cloud-sync-outline" onPress={onSync} outlined>
        <View>
          <Caption style={{ color: colors.text, fontSize: 16 }}>Синхронизировать</Caption>
          {!!syncDate && (
            <Caption style={[styles.caption, { color: colors.text }]}>
              {getDateString(syncDate)} {new Date(syncDate).toLocaleTimeString()}
            </Caption>
          )}
        </View>
      </PrimeButton>
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
    fontSize: 15,
    lineHeight: 15,
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
