import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Avatar, Caption, Divider, Drawer, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSelector } from '@lib/store';
import { PrimeButton } from '@lib/mobile-ui';
import { getDateString } from '@lib/mobile-hooks';

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps & ICutsomProps;

const SyncBtn = ({ onSync }: { onSync?: () => void }) => {
  const { colors } = useTheme();
  const { syncDate } = useSelector((state) => state.app);
  const captionStyle = { color: colors.text, fontSize: 16 };

  return (
    <PrimeButton icon="cloud-sync-outline" onPress={onSync} outlined>
      <View>
        <Caption style={captionStyle}>Синхронизировать</Caption>
        {!!syncDate && (
          <Caption style={[styles.caption, { color: colors.text }]}>
            {getDateString(syncDate)} {new Date(syncDate).toLocaleTimeString('ru', { hour12: false })}
          </Caption>
        )}
      </View>
    </PrimeButton>
  );
};

export const DrawerContent = ({ onSync, ...props }: Props) => {
  const { colors } = useTheme();
  const { user, company, isDemo } = useSelector((state) => state.auth);

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
      <DrawerContentScrollView {...props} contentContainerStyle={styles.contentStyle}>
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
      {!isDemo && <SyncBtn onSync={onSync} />}
    </>
  );
};

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
    marginBottom: 4,
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
    fontSize: 16,
    lineHeight: 16,
  },
  drawerSection: {
    marginTop: 0,
  },
  contentStyle: {
    paddingTop: 4,
  },
});
