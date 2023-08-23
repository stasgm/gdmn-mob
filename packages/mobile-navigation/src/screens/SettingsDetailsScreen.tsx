import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { authActions, settingsActions, useAuthThunkDispatch, useDispatch, useSelector } from '@lib/store';
import { AppDialog, AppScreen, SettingsGroup, navBackButton } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';

import { mobileRequest } from '@lib/mobile-hooks';

import { SettingsStackParamList } from '../navigation/Root/types';
const SettingsDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const id = useRoute<RouteProp<SettingsStackParamList, 'SettingsDetails'>>().params?.id;
  const data = useSelector((state) => state.settings.data);
  const { loading } = useSelector((state) => state.auth);

  const list = Object.values(data)
    .filter((item) => item && item?.visible && item?.group?.id === id)
    .sort((itema, itemb) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0));

  const groupName = list?.[0]?.group?.name || '';
  const groupDescription = list?.[1]?.group?.description || '';

  //Для перерисовки
  const [key, setKey] = useState(1);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [accsessCode, setAccessCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [updateOption, setUpdateOption] = useState<any>(undefined);

  const handleDismissDialog = () => {
    setVisibleDialog(false);
    setAccessCode('');
    setErrorMessage('');
    if (updateOption) {
      dispatch(
        settingsActions.updateOption({
          optionName: updateOption.optionName,
          value: data[updateOption.optionName],
        }),
      );
      setKey(key + 1);
    }
  };

  const handleUpdate = (optionName: string, value: ISettingsOption) => {
    setUpdateOption({ optionName, value });
    if (value.group?.checkSettingsCode || value.checkSettingsCode) {
      setVisibleDialog(true);
    } else {
      dispatch(settingsActions.updateOption({ optionName, value }));
    }
  };

  const handleVerifyCode = async () => {
    const res = await authDispatch(authActions.checkAccessCode(mobileRequest(authDispatch, authActions), accsessCode));

    if (res.type === 'AUTH/VERIFY_ACCESS_CODE_SUCCESS') {
      if (res.payload) {
        dispatch(settingsActions.updateOption(updateOption));
        setAccessCode('');
        setVisibleDialog(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Неправильный код!');
      }
    } else if (res.type === 'AUTH/VERIFY_ACCESS_CODE_FAILURE') {
      setErrorMessage('Ошибка подключения');
    }
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

    if (optionName === 'scannerUse') {
      const screenKeyboard = Object.values(data).find((i) => i?.id === 'screenKeyboard');

      if (screenKeyboard) {
        dispatch(
          settingsActions.updateOption({
            optionName: 'screenKeyboard',
            value: { ...screenKeyboard, readonly: !value.data, data: true },
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
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={localStyles.scrollView}>
        <SettingsGroup
          key={key}
          list={list}
          groupDescription={groupDescription}
          onValueChange={handleUpdate}
          onCheckSettings={handleCheckSettings}
        />
      </KeyboardAwareScrollView>
      <AppDialog
        title="Введите пароль"
        visible={visibleDialog}
        text={accsessCode}
        onChangeText={setAccessCode}
        onCancel={handleDismissDialog}
        onOk={handleVerifyCode}
        okLabel={'Ок'}
        errorMessage={errorMessage}
        loadIcon={loading}
        okDisabled={loading || !accsessCode.length}
        cancelDisabled={loading}
      />
    </AppScreen>
  );
};

export default SettingsDetailsScreen;

const localStyles = StyleSheet.create({
  scrollView: {
    padding: 5,
    flexDirection: 'column',
  },
});
