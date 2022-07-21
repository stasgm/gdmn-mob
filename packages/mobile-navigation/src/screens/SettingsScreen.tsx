import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { baseSettingGroup, settingsActions, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  DrawerButton,
  MenuButton,
  useActionSheet,
  SettingsGroup,
  AppScreen,
} from '@lib/mobile-ui';
import { INamedEntity, ISettingsOption, Settings, SettingValue } from '@lib/types';

const SettingsSceen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const showActionSheet = useActionSheet();
  const data = useSelector((state) => state.settings.data);
  const config = useSelector((state) => state.auth.config);

  const { colors } = useTheme();

  const settsData = useMemo(
    () =>
      Object.entries(data).reduce((prev: Settings, cur: [string, ISettingsOption<SettingValue> | undefined]) => {
        if (cur[1]) {
          const newCur = cur[1]?.group ? cur[1] : { ...cur[1], group: baseSettingGroup };
          prev[cur[0]] = newCur;
        }
        return prev;
      }, {}),
    [data],
  );

  //Массив уникальных групп настроек
  const parents = useMemo(
    () =>
      Object.entries(settsData).reduce(
        (prev: INamedEntity[], cur: [string, ISettingsOption<SettingValue> | undefined]) => {
          const obj = cur[1];

          if (obj?.group === undefined || prev.find((gr) => gr.id === obj?.group?.id)) {
            return prev;
          }

          return [...prev, obj.group];
        },
        [],
      ),
    [settsData],
  );

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

  const serverPath = `${config?.protocol}${config?.server}:${config?.port}/${config?.apiPath}`;

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5, flexDirection: 'column' }]}>
        <View>
          <Text style={styles.title}>Параметры связи с сервером</Text>
          <Divider />
          <View style={styles.details}>
            <Text style={styles.name}>Путь к серверу</Text>
            <Text style={[styles.number, styles.field, { color: colors.text }]}>{serverPath}</Text>
          </View>
        </View>
        <View>
          {parents.map((group, groupKey) => {
            const list = Object.entries(settsData)
              .filter(([_, item]) => item?.visible && item.group?.id === group.id)
              .sort(([, itema], [, itemb]) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));
            return (
              <View key={groupKey}>
                <SettingsGroup key={groupKey} group={group} list={list} onValueChange={handleUpdate} />
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default SettingsSceen;

const localStyles = StyleSheet.create({
  details: {
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    opacity: 0.5,
  },
});
