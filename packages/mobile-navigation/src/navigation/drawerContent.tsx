import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

import Constants from 'expo-constants';

import { useDispatch, useSelector, documentActions, referenceActions } from '@lib/store';

interface ICutsomProps {
  onSync?: () => void;
  syncing?: boolean;
}

type Props = DrawerContentComponentProps<DrawerContentOptions> & ICutsomProps;

export function DrawerContent({ onSync, syncing, ...props }: Props) {
  const { colors } = useTheme();

  const { user, company } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleUpdate = async () => {
    // Загрузка данных
    if (onSync) {
      // Если передан внешний обработчик то вызываем
      return onSync();
    }

    /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
    setLoading(true);

    await dispatch(referenceActions.deleteAllReferences());
    await dispatch(documentActions.deleteDocuments());
    /*
         await dispatch(
          referenceActions.addReferences({
            [refApplStatuses.name]: refApplStatuses,
            [refEmplyees.name]: refEmplyees,
          }),
          );
          await dispatch(documentActions.addDocuments(applDocuments));
      */

    setLoading(false);
  };

  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <>
      <View style={styles.userProfile}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity onPress={props.navigation.toggleDrawer}>
            <Avatar.Icon size={50} icon="badge-account-horizontal-outline" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Title style={styles.title}>{user?.firstName}</Title>
            <Title style={styles.title}>{user?.lastName}</Title>
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
          {/*  <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                // toggleTheme();
              }}
            >
              <View style={styles.preference}>
                <Text style={styles.text}>Тёмная тема</Text>
                <View pointerEvents="none">
                  <Switch value={theme === 'dark'} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </Animated.View>
      </DrawerContentScrollView>
      {/* <Divider /> */}
      <View style={styles.systemInfo}>
        <TouchableOpacity disabled={syncing || isLoading} onPress={handleUpdate}>
          <Avatar.Icon size={50} icon="cloud-refresh" />
        </TouchableOpacity>
        <View style={styles.updateSection}>
          <Caption style={styles.caption}>{syncing || isLoading ? 'загрузка данных...' : ''}</Caption>
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
    paddingRight: 10,
    paddingBottom: 5,
  },
  systemInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
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
