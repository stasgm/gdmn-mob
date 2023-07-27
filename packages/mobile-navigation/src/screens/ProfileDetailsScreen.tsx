import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useSelector, settingsActions } from '@lib/store';

import { MenuButton, DescriptionItem, AppScreen, useActionSheet, navBackButton } from '@lib/mobile-ui';
import { useSettingsThunkDispatch } from '@lib/store/src/settings/actions.async';

const ProfileDetailsScreen = () => {
  const userSettings = useSelector((state) => state.settings.userData);
  const settingsDispatch = useSettingsThunkDispatch();
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const handleClearSettings = () => {
    Alert.alert('Вы уверены, что хотите удалить настройки пользователя?', '', [
      {
        text: 'Да',
        onPress: () => {
          settingsDispatch(settingsActions.setUserSettings({}));
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
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
  }, [handleClearSettings, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  const visibleList = userSettings && Object.entries(userSettings).filter(([_, item]) => item.visible);

  return (
    <AppScreen>
      <View style={styles.container}>
        {!!visibleList?.length && (
          <View style={styles.descriptionContainer}>
            {visibleList.map(([key, item]) => (
              <View key={key}>
                <Divider />
                <DescriptionItem description={item.description} data={item.data}></DescriptionItem>
              </View>
            ))}
          </View>
        )}
      </View>
    </AppScreen>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  descriptionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
  },
  title: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});
