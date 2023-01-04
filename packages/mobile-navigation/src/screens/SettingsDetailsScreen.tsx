import React, { useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { AppScreen, SettingsGroup, navBackButton } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { SettingsStackParamList } from '../navigation/Root/types';

const SettingsDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const id = useRoute<RouteProp<SettingsStackParamList, 'SettingsDetails'>>().params?.id;

  const data = useSelector((state) => state.settings.data);

  const list = Object.entries(data)
    .filter(([_, item]) => item?.visible && item?.group?.id === id)
    .sort(([, itema], [, itemb]) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));

  const groupName = list?.[0]?.[1]?.group?.name || '';
  const groupDescription = list?.[0]?.[1]?.group?.description || '';

  const handleUpdate = (optionName: string, value: ISettingsOption) => {
    dispatch(settingsActions.updateOption({ optionName, value }));
  };

  const handleUpdateAutoSynch = (optionName: string, value: ISettingsOption) => {
    const synchPeriod = list.find(([item, _]) => item === 'synchPeriod')?.[1]?.data;
    if (optionName === 'autoSynchPeriod' && synchPeriod && value.data < synchPeriod) {
      dispatch(settingsActions.updateOption({ optionName, value: { ...value, data: synchPeriod } }));

      Alert.alert('Внимание!', 'Период автосинхронизации не может быть меньше периода синхронизации на сервере', [
        { text: 'OK' },
      ]);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      title: groupName,
    });
  }, [navigation]);

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5, flexDirection: 'column' }]}>
        <View>
          <SettingsGroup
            list={list}
            groupDescription={groupDescription}
            onValueChange={handleUpdate}
            onCheckSettings={handleUpdateAutoSynch}
          />
        </View>
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default SettingsDetailsScreen;
