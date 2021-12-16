import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles, DrawerButton, MenuButton, useActionSheet, SettingsGroup } from '@lib/mobile-ui';
import { INamedEntity, ISettingsOption, SettingValue } from '@lib/types';

const SettingsSceen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();

  const { data } = useSelector((state) => state.settings);
  const { settings } = useSelector((state) => state.auth);
  Object.entries(data).forEach((item) => {
    if (!item[1]?.group) {
      item[1]!.group = { id: '1', name: 'Настройки приложения', sortOrder: 1 };
    }
  });

  const parents = Object.entries(data).reduce(
    (prev: INamedEntity[], cur: [string, ISettingsOption<SettingValue> | undefined]) => {
      const obj = cur[1];

      if (obj?.group === undefined || prev.find((gr) => gr.id === obj?.group?.id)) {
        return prev;
      }

      return [...prev, obj.group];
    },
    [],
  );
  //console.log('SettS1', parents);
  //console.log('SettS2', data);

  const handleUpdate = (optionName: string, value: ISettingsOption) => {
    dispatch(settingsActions.updateOption({ optionName, value }));
  };

  const handleReset = useCallback(() => {
    dispatch(settingsActions.init());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Установить настройки по умолчанию',
        type: 'destructive',
        onPress: handleReset,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleReset, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation, actionsMenu]);

  const serverPath = `${settings?.protocol}${settings?.server}:${settings?.port}/${settings?.apiPath}`;

  return (
    <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5 }]}>
      <View>
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
      </View>
      <View>
        <View>
          {parents.map((item, key) => {
            return item ? (
              <View key={key}>
                <SettingsGroup
                  key={key}
                  group={item}
                  data={data}
                  onValueChange={(optionName, value) => handleUpdate(optionName, value)}
                />
                <Divider />
              </View>
            ) : null;
          })}
        </View>
        {/* <FlatList
              data={settingList}
              keyExtractor={(item, _) => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={Divider}
            /> */}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SettingsSceen;
