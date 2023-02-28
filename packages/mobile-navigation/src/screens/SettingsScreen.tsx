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

  const { colors } = useTheme();

  //Если группа не указана, подставляем базовую группу
  const settsData = useMemo(
    () =>
      Object.entries(data).reduce(
        (prev: Settings, [idx, value]: [string, ISettingsOption<SettingValue> | undefined]) => {
          if (value) {
            const newCur = value?.group ? value : { ...value, group: baseSettingGroup };
            prev[idx] = newCur;
          }
          return prev;
        },
        {},
      ),
    [data],
  );

  //Массив уникальных групп настроек
  const parents = useMemo(
    () =>
      Object.values(settsData)
        .sort((itema, itemb) => (itema?.group?.sortOrder || 0) - (itemb?.group?.sortOrder || 0))
        .reduce((prev: INamedEntity[], value: ISettingsOption<SettingValue>) => {
          if (value?.group === undefined || prev.find((gr) => gr.id === value?.group?.id)) {
            return prev;
          }

          return [...prev, value.group];
        }, []),
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

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5, flexDirection: 'column' }]}>
        <View>
          {parents.map((group, groupKey) => {
            const list = Object.values(settsData)
              .filter((item) => item?.visible && item.group?.id === group.id)
              .sort((itema, itemb) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));
            return (
              <View key={groupKey}>
                {group.id === 'base' ? (
                  <SettingsGroup key={groupKey} list={list} onValueChange={handleUpdate} />
                ) : (
                  <View key={groupKey}>
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
});
