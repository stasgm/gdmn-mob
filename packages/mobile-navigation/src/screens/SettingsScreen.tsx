import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider, IconButton } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { baseSettingGroup, settingsActions, useDispatch, useSelector } from '@lib/store';
import { MenuButton, useActionSheet, SettingsGroup, AppScreen, MediumText, navBackDrawer } from '@lib/mobile-ui';
import { INamedEntity, ISettingsOption, Settings, SettingValue } from '@lib/types';

import { SettingsStackParamList } from '../navigation/Root/types';

const SettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList, 'Settings'>>();
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
      headerLeft: navBackDrawer,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation, actionsMenu]);

  const serverPath = `${config?.protocol}${config?.server}:${config?.port}/${config?.apiPath}`;

  const handleUpdateOption = (optionName: string, value: ISettingsOption) => {
    if (optionName === 'scannerUse') {
      const screenKeyboard = Object.values(settsData).find((i) => i?.id === 'screenKeyboard');

      if (screenKeyboard) {
        dispatch(
          settingsActions.updateOption({
            optionName: 'screenKeyboard',
            value: { ...screenKeyboard, readonly: value.data ? true : false, data: true },
          }),
        );
      }
    }
  };

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5, flexDirection: 'column' }]}>
        <View>
          {parents.map((group, groupKey) => {
            const list = Object.entries(settsData)
              .filter(([_, item]) => item?.visible && item.group?.id === group.id)
              .sort(([, itema], [, itemb]) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));
            return (
              <View key={groupKey}>
                {group.id === 'base' ? (
                  <SettingsGroup
                    key={groupKey}
                    list={list}
                    onValueChange={handleUpdate}
                    onCheckSettings={handleUpdateOption}
                  />
                ) : (
                  <View key={groupKey} style={localStyles.group}>
                    <Divider />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('SettingsDetails', { id: group.id });
                      }}
                    >
                      <View style={localStyles.container}>
                        <View style={localStyles.details}>
                          <MediumText>{group.name}</MediumText>
                        </View>
                        <IconButton icon="chevron-right" color={colors.text} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default SettingsScreen;

const localStyles = StyleSheet.create({
  details: {
    marginVertical: 5,
    paddingHorizontal: 12,
    height: 32,
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  group: {
    paddingTop: 6,
  },
});
