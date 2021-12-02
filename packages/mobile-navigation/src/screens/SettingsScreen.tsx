import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { SettingsItem, globalStyles as styles, DrawerButton, MenuButton, useActionSheet } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';
export type SettingListItem = ISettingsOption & { setName: string };

const SettingsSceen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();

  const { data } = useSelector((state) => state.settings);
  const { settings } = useSelector((state) => state.auth);
  /////
// const settingList = useMemo(() => {
  //   return Object.entries(data)
  //     .map(([key, value]) => ({ ...value, setName: key } as SettingListItem))
  //     .filter((i) => i.visible);
  // }, [data]);

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

  // const renderItem = ({ item }: { item: SettingListItem }) => (
  //   <SettingsItem
  //     key={item.id}
  //     label={item.description || item.setName}
  //     value={item.data}
  //     onValueChange={(newValue) => {
  //       const { setName, ...rest } = item;
  //       handleUpdate(item.setName, { ...rest, data: newValue });
  //     }}
  //   />
  // );

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
        <Text style={[styles.title]}>Настройки приложения</Text>
        <Divider />
        <View>
          {Object.entries(data)
            .filter(([_, item]) => item?.visible)
            .sort(([, itema], [, itemb]) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0))
            .map(([key, item]) => {
              return item ? (
                <View key={key}>
                  <SettingsItem
                    key={key}
                    label={item.description || key}
                    value={item.data}
                    onValueChange={(newValue) => handleUpdate(key, { ...item, data: newValue })}
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
