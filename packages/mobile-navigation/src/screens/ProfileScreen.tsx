import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';

import {
  authActions,
  useSelector,
  useDispatch,
  documentActions,
  referenceActions,
  appActions,
  useAuthThunkDispatch,
  useDocThunkDispatch,
  useSettingThunkDispatch,
  settingsActions,
} from '@lib/store';

import {
  MenuButton,
  PrimeButton,
  DescriptionItem,
  MediumText,
  AppScreen,
  useActionSheet,
  globalStyles,
  LargeText,
  Switch,
  navBackDrawer,
} from '@lib/mobile-ui';
import api from '@lib/client-api';
import { mobileRequest } from '@lib/mobile-hooks';

const ProfileScreen = () => {
  const { colors } = useTheme();

  const { user, company, device, isDemo, loading, isLogout } = useSelector((state) => state.auth);

  const userSettings = user?.settings;

  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const docDispatch = useDocThunkDispatch();
  const settingsDispatch = useSettingThunkDispatch();
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const handleClearData = () => {
    Alert.alert('Вы уверены, что хотите удалить все данные?', '', [
      {
        text: 'Да',
        onPress: () => {
          dispatch(documentActions.init());
          dispatch(referenceActions.init());
          dispatch(appActions.init());
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  };

  const handleClearSettings = () => {
    Alert.alert('Вы уверены, что хотите удалить настройки пользователя?', '', [
      {
        text: 'Да',
        onPress: () => {
          authDispatch(authActions.setUserSettings({}));
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Вы уверены, что хотите выйти и удалить все данные?',
      'После удаления данные не подлежат восстановлению.',
      [
        {
          text: 'Да',
          onPress: () => {
            docDispatch(documentActions.init());
            dispatch(referenceActions.init());
            dispatch(appActions.init());
            settingsDispatch(settingsActions.init());
            authDispatch(authActions.init());
          },
        },
        {
          text: 'Отмена',
        },
      ],
    );
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Выйти и удалить все данные',
        type: 'destructive',
        onPress: handleClearAll,
      },
      {
        title: 'Удалить все справочники и документы',
        type: 'destructive',
        onPress: handleClearData,
      },
      {
        title: 'Удалить настройки пользователя',
        type: 'destructive',
        onPress: handleClearSettings,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleClearData, handleClearSettings, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const handleLogout = () => {
    authDispatch(authActions.logout(mobileRequest(dispatch, authActions)));
    api.config.debug = api.config.debug ? { ...api.config.debug, isMock: false } : { isMock: false };
  };

  const visibleList = userSettings && Object.entries(userSettings).filter(([_, item]) => item.visible);

  const handleUpdate = (value: boolean) => {
    dispatch(authActions.setIsLogOut(!value));
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Avatar.Icon
              size={50}
              icon="badge-account-horizontal-outline"
              style={{ backgroundColor: colors.primary }}
            />
          </View>
          <View style={styles.profileInfo}>
            {user?.firstName ? <MediumText style={globalStyles.textBold}>{user?.firstName}</MediumText> : null}
            <MediumText style={globalStyles.textBold}>
              {!user?.firstName && !user?.lastName ? user?.name : user?.lastName || 'ffffff'}
            </MediumText>
            <MediumText>{company?.name || ''}</MediumText>
          </View>
        </View>
        <Divider />
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Avatar.Icon size={50} icon="devices" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={styles.profileInfo}>
            <MediumText style={globalStyles.textBold}>{device?.name || ''}</MediumText>
            <MediumText>{device?.state || ''}</MediumText>
          </View>
        </View>
        <Divider />
        <View style={[styles.containerSet, { borderColor: colors.primary }]}>
          <MediumText style={styles.subHeading}>{'Не выходить из профиля'}</MediumText>
          <Switch value={!isLogout} onValueChange={handleUpdate} />
        </View>
        <Divider />
        {!!visibleList?.length && (
          <View>
            <LargeText style={styles.title}>Настройки пользователя</LargeText>
            <View style={styles.descriptionContainer}>
              {visibleList.map(([key, item]) => {
                return (
                  <View key={key}>
                    <Divider />
                    <DescriptionItem description={item.description} data={item.data}></DescriptionItem>
                  </View>
                );
              })}
            </View>
            <Divider />
          </View>
        )}
        <View>
          <PrimeButton outlined onPress={handleLogout} disabled={loading} loadIcon={loading}>
            {isDemo ? 'Выйти из демо режима' : 'Сменить пользователя'}
          </PrimeButton>
        </View>
      </View>
    </AppScreen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  containerSet: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    fontSize: 20,
    paddingVertical: 3,
    marginVertical: 6,
  },
  subHeading: {
    width: '85%',
    fontSize: 15,
  },
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
  title: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});
