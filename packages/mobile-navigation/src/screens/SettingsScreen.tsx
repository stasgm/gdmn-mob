import React, { useLayoutEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { AppScreen, SettingsItem, globalStyles as styles, DrawerButton } from '@lib/mobile-ui';

import { ISettingsOption } from '@lib/types';

const SettingsSceen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.settings);
  const { settings } = useSelector((state) => state.auth);

  const handleUpdate = (optionName: string, value: ISettingsOption<string | number | boolean>) => {
    dispatch(settingsActions.updateSettings({ optionName, value }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  const serverPath = `${settings?.protocol}${settings?.server}:${settings?.port}/${settings?.apiPath}`;

  return (
    <AppScreen style={styles.contentTop}>
      <ScrollView>
        <Text style={[styles.title]}>Параметры связи с сервером</Text>
        <Divider />
        <View style={styles.details}>
          <Text style={styles.name}>Путь к серверу</Text>
          <Text style={[styles.number, styles.field]}>{serverPath}</Text>
        </View>
        <Divider />
        <View style={styles.details}>
          <Text style={styles.name}>Время ожидания ответа сервера, мс.</Text>
          <Text style={[styles.number, styles.field]}>{settings?.timeout}</Text>
        </View>
        {/* <Divider /> */}
        <Text style={[styles.title]}>Настройки приложения</Text>
        <Divider />
        <View>
          {Object.entries(data).map(([key, item]) => {
            return (
              <View key={key}>
                <SettingsItem
                  key={key}
                  label={item.description || key}
                  value={item.data}
                  onValueChange={() => handleUpdate(key, item)}
                />
                <Divider />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default SettingsSceen;

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
 */
