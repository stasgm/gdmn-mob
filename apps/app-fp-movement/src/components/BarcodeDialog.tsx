import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardTypeOptions, View, StyleSheet, Text, SafeAreaView, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Dialog, Button, TextInput } from 'react-native-paper';
import { LargeText, SelectableInput } from '@lib/mobile-ui';
import DateTimePicker from '@react-native-community/datetimepicker';

import { appActions, IFormParam, useDispatch, useSelector } from '@lib/store';

import { getDateString } from '@lib/mobile-hooks';

import { IBox, IFreeShipmentLine } from '../store/types';

interface IProps {
  visible: boolean;
  onOk: (a: any) => void;
  onCancel: () => void;
  okLabel?: string;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  screenName: string;
  line?: IFreeShipmentLine;
  box?: IBox;
  remainsUse?: boolean;
}
export interface IBarcodeFormParam extends IFormParam {
  workDate?: string;
  numReceived?: string;
  quantity?: string;
}

const BarcodeDialog = ({
  visible,
  onOk,
  onCancel,
  okLabel = 'Ок',
  // okDisabled = false,
  cancelDisabled = false,
  keyboardType = 'default',
  screenName,
  line,
  box,
  remainsUse = true,
}: IProps) => {
  const { colors } = useTheme();

  const forms = useSelector((state) => state.app.screenFormParams);

  const {
    workDate: docWorkDate,
    numReceived: docNumReceived,
    quantity: docQuantity,
  } = (forms && screenName && forms[screenName] ? forms[screenName] : {}) as IBarcodeFormParam;
  const [errorMessage, setErrorMessage] = useState<string>('');

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(appActions.clearScreenFormParams(screenName));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDate = (date?: Date) => {
    return new Date(new Date(date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)).getTime());
  };

  useEffect(() => {
    const formParams = {
      workDate: getDate().toISOString(),
      numReceived: '',
      quantity: '',
    };
    dispatch(
      appActions.setScreenFormParams({
        screenName: screenName,
        params: formParams,
      }),
    );
  }, [dispatch, screenName]);

  const handleChangeNumReceived = useCallback(
    (text: string) =>
      dispatch(
        appActions.setScreenFormParams({
          screenName: screenName,
          params: { numReceived: text },
        }),
      ),
    [dispatch, screenName],
  );

  const handleChangeQuantity = useCallback(
    (text: string) =>
      dispatch(
        appActions.setScreenFormParams({
          screenName: screenName,
          params: { quantity: text },
        }),
      ),
    [dispatch, screenName],
  );

  const [showWorkDate, setShowWorkDate] = useState(false);

  const handleApplyWorkDate = useCallback(
    (_event: any, selectedWorkDate: Date | undefined) => {
      setShowWorkDate(false);

      if (selectedWorkDate) {
        dispatch(
          appActions.setScreenFormParams({
            screenName: screenName,
            params: { workDate: getDate(selectedWorkDate).toISOString() },
          }),
        );
      }
    },
    [dispatch, screenName],
  );

  const handleChangeWorkDate = useCallback(() => {
    Keyboard.dismiss();
    setShowWorkDate(true);
  }, []);

  const checkWeightIsNaN = (text: string) => {
    let newValue = text.replace(',', '.');
    newValue = !newValue.includes('.') ? parseFloat(newValue).toString() : newValue;
    return Number.isNaN(parseFloat(newValue));
  };

  const handleSave = useCallback(() => {
    if (!line) {
      setErrorMessage('Не найдена позиция');
      return;
    }
    if (!(docNumReceived && docQuantity && docWorkDate)) {
      setErrorMessage('Не все поля заполнены.');
      return;
    }

    if ((docQuantity ? checkWeightIsNaN(docQuantity) : true) || checkWeightIsNaN(docQuantity)) {
      setErrorMessage('Количество не соответствует числовому формату.');
      return;
    }

    if ((docQuantity ? checkWeightIsNaN(docQuantity) : true) || checkWeightIsNaN(docQuantity)) {
      setErrorMessage('Количество не соответствует числовому формату.');
      return;
    }

    if (remainsUse && line.weight < Number(docQuantity)) {
      setErrorMessage('Количество товара превышает количество в остатках!');
      return;
    }

    if (box && box.workDate && !(new Date(box.workDate).getTime() === new Date(docWorkDate).getTime())) {
      setErrorMessage('Введенная дата производства не совпадает с датой производства товара в коробке.');
      return;
    }

    if (box && box.numReceived && !(box.numReceived === docNumReceived)) {
      setErrorMessage('Введенный номер партии не совпадает с номером партии товара в коробке.');
      return;
    }

    const newLine: IFreeShipmentLine = {
      ...line,
      numReceived: docNumReceived,
      quantity: Number(docQuantity) || 0,
      workDate: new Date(docWorkDate) ? new Date(docWorkDate).toISOString() : new Date().toISOString(),
      weight: 0,
    };

    onOk(newLine);
    const formParams = {
      workDate: getDate().toISOString(),
      numReceived: '',
      quantity: '',
    };
    dispatch(
      appActions.setScreenFormParams({
        screenName: screenName,
        params: formParams,
      }),
    );
    // dispatch(appActions.clearScreenFormParams(screenName));
    setErrorMessage('');
  }, [box, dispatch, docNumReceived, docQuantity, docWorkDate, line, onOk, remainsUse, screenName]);

  const handleCancel = useCallback(() => {
    const formParams = {
      workDate: getDate().toISOString(),
      numReceived: '',
      quantity: '',
    };
    dispatch(
      appActions.setScreenFormParams({
        screenName: screenName,
        params: formParams,
      }),
    );
    setErrorMessage('');
    onCancel && onCancel();
  }, [dispatch, onCancel, screenName]);

  return (
    <>
      {showWorkDate && (
        <SafeAreaView>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(docWorkDate || '')}
            mode="date"
            // display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleApplyWorkDate}
          />
        </SafeAreaView>
      )}
      <Dialog visible={visible} onDismiss={handleCancel}>
        <Dialog.Content>
          <View style={localStyles.titleView}>
            <LargeText style={localStyles.titleText}>Количество</LargeText>
          </View>
          <TextInput
            theme={{
              colors: {
                primary: colors.primary,
                text: colors.text,
                placeholder: colors.primary,
              },
            }}
            value={docQuantity}
            onChangeText={handleChangeQuantity}
            right={
              !!docQuantity && (
                <TextInput.Icon
                  icon="close"
                  size={20}
                  style={localStyles.marginTop}
                  onPress={() => handleChangeQuantity('')}
                />
              )
            }
            keyboardType={keyboardType ? keyboardType : 'default'}
            style={localStyles.height}
          />
          <View style={localStyles.titleView}>
            <LargeText style={localStyles.titleText}>Партия</LargeText>
          </View>
          <TextInput
            theme={{
              colors: {
                primary: colors.primary,
                text: colors.text,
                placeholder: colors.primary,
              },
            }}
            value={docNumReceived}
            onChangeText={handleChangeNumReceived}
            right={
              !!docNumReceived && (
                <TextInput.Icon
                  icon="close"
                  size={20}
                  style={localStyles.marginTop}
                  onPress={() => handleChangeNumReceived('')}
                />
              )
            }
            keyboardType={keyboardType ? keyboardType : 'default'}
            style={localStyles.height}
          />
          <View style={localStyles.titleView}>
            <LargeText style={localStyles.titleText}>Дата</LargeText>
          </View>
          <SelectableInput
            label=""
            value={getDateString(docWorkDate || '')}
            onPress={handleChangeWorkDate}
            mode="flat"
            style={localStyles.marginHorizontal}
            iconViewStyle={localStyles.icon}
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
            disabled={!(docNumReceived && docQuantity && docWorkDate) /*okDisabled*/}
          >
            {okLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
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

export default BarcodeDialog;
