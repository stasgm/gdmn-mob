import React, { useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { AppScreen, SettingsGroup, navBackButton } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';

import { SettingsStackParamList } from '../navigation/Root/types';

const SettingsDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const id = useRoute<RouteProp<SettingsStackParamList, 'SettingsDetails'>>().params?.id;
  const data = useSelector((state) => state.settings.data);

  const list = Object.values(data)
    .filter((item) => item && item?.visible && item?.group?.id === id)
    .sort((itema, itemb) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));

  const groupName = list?.[0]?.group?.name || '';
  const groupDescription = list?.[1]?.group?.description || '';

  //Для перерисовки
  const [key, setKey] = useState(1);

  const handleUpdate = (optionName: string, value: ISettingsOption) => {
    dispatch(settingsActions.updateOption({ optionName, value }));
  };

  const handleCheckSettings = (optionName: string, value: ISettingsOption) => {
    const synchPeriod = list.find((item) => item?.id === 'synchPeriod')?.data;
    if (optionName === 'autoSynchPeriod' && synchPeriod && value.data < synchPeriod) {
      dispatch(settingsActions.updateOption({ optionName, value: { ...value, data: synchPeriod } }));

      Alert.alert('Внимание!', 'Период автосинхронизации не может быть меньше периода синхронизации на сервере.', [
        { text: 'OK' },
      ]);
      setKey(key + 1);
    }

    if (optionName === 'autoSync') {
      const autoSynchPeriod = list.find((itema) => itema?.id === 'autoSynchPeriod');

      if (autoSynchPeriod) {
        dispatch(
          settingsActions.updateOption({
            optionName: 'autoSynchPeriod',
            value: { ...autoSynchPeriod, readonly: !value.data },
          }),
        );
      }
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
        <SettingsGroup
          key={key}
          list={list}
          groupDescription={groupDescription}
          onValueChange={handleUpdate}
          onCheckSettings={handleCheckSettings}
        />
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default SettingsDetailsScreen;
