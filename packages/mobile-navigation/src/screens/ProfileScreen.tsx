import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { authActions, useSelector, useDispatch, documentActions, referenceActions } from '@lib/store';

import { DrawerButton, MenuButton } from '@lib/mobile-ui/src/components/AppBar';
import { PrimeButton, DescriptionItem } from '@lib/mobile-ui/src/components';
import api from '@lib/client-api';

import { useActionSheet } from '@lib/mobile-ui';

const ProfileScreen = () => {
  const { colors } = useTheme();

  const { user, company, device, settings: authSettings } = useSelector((state) => state.auth);

  const settings = user?.settings;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const handleClearData = () => {
    dispatch(documentActions.init());
    dispatch(referenceActions.init());
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Очистить данные',
        type: 'destructive',
        onPress: handleClearData,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleClearData, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
  };

  const visibleList = settings && Object.entries(settings).filter(([_, item]) => item.visible);

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer]}>
        <View style={styles.profileIcon}>
          <Avatar.Icon size={50} icon="badge-account-horizontal-outline" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{user?.firstName || ''}</Text>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>
            {!user?.firstName && !user?.lastName ? user?.name : user?.lastName || ''}
          </Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.placeholder }]}>{company?.name || ''}</Text>
        </View>
      </View>
      <Divider />
      <View style={[styles.profileContainer]}>
        <View style={styles.profileIcon}>
          <Avatar.Icon size={50} icon="devices" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{device?.name || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.state || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.uid || ''}</Text>
        </View>
      </View>
      {!!visibleList?.length && (
        <View>
          <Text style={[styles.title]}>Настройки пользователя</Text>
          <View style={[styles.descriptionContainer]}>
            {visibleList.map(([key, item]) => {
              return (
                <View key={key}>
                  <Divider />
                  <DescriptionItem description={item.description} data={item.data}></DescriptionItem>
                </View>
              );
            })}
          </View>
        </View>
      )}
      <View>
        <PrimeButton outlined onPress={handleLogout}>
          {authSettings.debug?.isMock ? 'Выйти из демо режима' : 'Сменить пользователя'}
        </PrimeButton>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginVertical: 10,
  },
  descriptionContainer: {
    // alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
  },
  profileIcon: {
    justifyContent: 'space-around',
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileInfoTextCompany: {
    fontSize: 14,
    fontWeight: '300',
  },
  profileInfoTextUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});
