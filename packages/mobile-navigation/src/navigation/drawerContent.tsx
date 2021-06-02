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

import { useDispatch, useSelector, documentActions, referenceActions } from '@lib/store';

import {
  routeMock,
  orderMock,
  goodRefMock,
  contactRefMock,
  outletRefMock,
  debtRefMock,
  goodGroupRefMock,
} from '../../../../apps/app-trade-agents/src/store/docs/mock';

type Props = DrawerContentComponentProps<DrawerContentOptions>;

export function DrawerContent(props: Props) {
  const paperTheme = useTheme();

  const { user, company } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleUpdate = async () => {
    // Загрузка данных
    setLoading(true);

    await dispatch(referenceActions.deleteAllReferences());
    await dispatch(documentActions.deleteAllDocuments());

    await dispatch(
      referenceActions.addReferences({
        contact: contactRefMock,
        outlet: outletRefMock,
        debt: debtRefMock,
        goodGroup: goodGroupRefMock,
        good: goodRefMock,
      }),
    );
    await dispatch(documentActions.addDocuments(orderMock));
    await dispatch(documentActions.addDocuments(routeMock));

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
              backgroundColor: paperTheme.colors.surface,
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
        <TouchableOpacity onPress={handleUpdate}>
          <Avatar.Icon size={50} icon="cloud-refresh" />
        </TouchableOpacity>
        <View style={styles.updateSection}>
          <Caption style={styles.caption}>{isLoading ? 'загрузка данных...' : ''}</Caption>
          <Caption style={styles.caption}>Версия программы: 0.0.1</Caption>
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
