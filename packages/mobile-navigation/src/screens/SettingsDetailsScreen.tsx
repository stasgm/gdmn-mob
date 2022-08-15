import React, { useLayoutEffect, useMemo } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { settingsActions, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles, AppScreen, BackButton, SettingsGroup } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      title: groupName,
    });
  }, [navigation]);

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={[{ padding: 5, flexDirection: 'column' }]}>
        <View>
          <SettingsGroup list={list} groupDescription={groupDescription} onValueChange={handleUpdate} />
        </View>
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default SettingsDetailsScreen;
