import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardTypeOptions, View, StyleSheet, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Dialog, Button, TextInput } from 'react-native-paper';
import { LargeText, SelectableInput } from '@lib/mobile-ui';
import { StackNavigationProp } from '@react-navigation/stack';

import { IReference } from '@lib/types';

import { appActions, IFormParam, refSelectors, useDispatch, useSelector } from '@lib/store';

import { generateId } from '@lib/mobile-hooks';

import { FreeShipmentStackParamList, ShipmentStackParamList } from '../navigation/Root/types';
import { IBox } from '../store/types';
import { IPackage } from '../store/app/types';

interface IProps {
  visible: boolean;
  onOk: (a: any) => void;
  onCancel: () => void;
  okLabel?: string;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  lastBox?: IBox;
  screenName: string;
}
export interface IBoxFormParam extends IFormParam {
  box?: IPackage;
  weight?: string;
  additionalWeight?: string;
}

const BoxDialog = ({
  visible,
  onOk,
  onCancel,
  okLabel = 'Ок',
  // okDisabled = false,
  cancelDisabled = false,
  keyboardType = 'default',
  lastBox,
  screenName,
}: IProps) => {
  const { colors } = useTheme();
  // const navigation = useNavigation();
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList & FreeShipmentStackParamList>>();

  const forms = useSelector((state) => state.app.screenFormParams);

  const {
    box: docBox,
    weight: docWeight,
    additionalWeight: docAdditionalWeight,
  } = (forms && screenName && forms[screenName] ? forms[screenName] : {}) as IBoxFormParam;
  const [errorMessage, setErrorMessage] = useState<string>('');

  const dispatch = useDispatch();

  // useEffect(() => {
  //   return () => {
  //     dispatch(appActions.clearScreenFormParams(screenName));
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const clearFormParams = useCallback(
    () => dispatch(appActions.clearScreenFormParams(screenName)),
    [dispatch, screenName],
  );

  const packages: IPackage[] = refSelectors.selectByName<IReference<IPackage>>('packages')?.data;

  const lastLineBox = packages?.find((t) => lastBox?.packageId === t.id);

  useEffect(() => {
    const formParams = {
      box: docBox ? docBox : lastLineBox,
      weight: '',
      additionalWeight: '',
    };
    dispatch(
      appActions.setScreenFormParams({
        screenName: screenName,
        params: formParams,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, screenName]);

  const handleChangeWeight = useCallback(
    (text: string) =>
      dispatch(
        appActions.setScreenFormParams({
          screenName: screenName,
          params: { weight: text },
        }),
      ),
    [dispatch, screenName],
  );

  const handleChangePackage = () => {
    navigation.navigate('SelectRefItem', {
      screenName: screenName, ////////////////////////////////////
      refName: 'packages',
      fieldName: 'box',
      value: docBox && [docBox],
      additionalField: 'unitWeight',
    });
  };

  const handleChangeAdditionalWeight = useCallback(
    (text: string) =>
      dispatch(
        appActions.setScreenFormParams({
          screenName: screenName,
          params: { additionalWeight: text },
        }),
      ),
    [dispatch, screenName],
  );

  const checkWeightIsNaN = (text: string) => {
    let newValue = text.replace(',', '.');
    newValue = !newValue.includes('.') ? parseFloat(newValue).toString() : newValue;
    return Number.isNaN(parseFloat(newValue));
  };

  const handleSave = useCallback(() => {
    if (!(docBox && docWeight)) {
      setErrorMessage('Не все поля заполнены.');
      return;
    }

    if ((docAdditionalWeight ? checkWeightIsNaN(docAdditionalWeight) : true) || checkWeightIsNaN(docWeight)) {
      setErrorMessage('Вес не соответствует числовому формату.');
      return;
    }

    const newBox: IBox = {
      id: generateId(),
      packageWeight: Number(docWeight) || 0,
      packageId: docBox?.id,
      additionalWeight: Number(docAdditionalWeight) || 0,
    };
    onOk(newBox);
    dispatch(appActions.clearScreenFormParams(screenName));
  }, [dispatch, docAdditionalWeight, docBox, docWeight, onOk, screenName]);

  const handleCancel = useCallback(() => {
    clearFormParams();
    onCancel && onCancel();
  }, [clearFormParams, onCancel]);

  useEffect(() => {
    //Если меняем тару и в ней указан вес
    if (docBox) {
      handleChangeWeight((docBox?.unitWeight || '').toString());
    }
  }, [dispatch, docBox, handleChangeWeight, packages]);

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Content>
        <View style={localStyles.titleView}>
          <LargeText style={localStyles.titleText}>Тип тары</LargeText>
        </View>
        <SelectableInput
          mode="flat"
          value={docBox?.name || ''}
          onPress={handleChangePackage}
          disabled={false}
          style={localStyles.marginHorizontal}
          iconViewStyle={localStyles.icon}
        />
        <View style={localStyles.titleView}>
          <LargeText style={localStyles.titleText}> Вес тары</LargeText>
        </View>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={docWeight}
          onChangeText={handleChangeWeight}
          right={
            !!docWeight && (
              <TextInput.Icon
                icon="close"
                size={20}
                style={localStyles.marginTop}
                onPress={() => handleChangeWeight('')}
              />
            )
          }
          keyboardType={keyboardType ? keyboardType : 'default'}
          style={localStyles.height}
        />
        <View style={localStyles.titleView}>
          <LargeText style={localStyles.titleText}>Дополнительный вес тары</LargeText>
        </View>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={docAdditionalWeight}
          onChangeText={handleChangeAdditionalWeight}
          right={
            !!docWeight && (
              <TextInput.Icon
                icon="close"
                size={20}
                style={localStyles.marginTop}
                onPress={() => handleChangeAdditionalWeight('')}
              />
            )
          }
          keyboardType={keyboardType ? keyboardType : 'default'}
          style={localStyles.height}
        />
        {!!errorMessage && <Text style={{ color: colors.notification }}>{errorMessage}</Text>}
      </Dialog.Content>
      <Dialog.Actions style={{ borderColor: colors.primary }}>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={handleCancel}
          disabled={cancelDisabled}
        >
          Отмена
        </Button>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={handleSave}
          disabled={!docBox /*okDisabled*/}
        >
          {okLabel}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  marginTop: { marginTop: 7 },
  marginHorizontal: { marginHorizontal: 0 },
  titleView: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  titleText: { fontWeight: '600' },
  height: { height: 40 },
  icon: {
    borderRadius: 30,
    height: 30,
    width: 30,
    overflow: 'hidden',
    position: 'absolute',
    right: 3,
    top: 6,
  },
});

export default BoxDialog;
