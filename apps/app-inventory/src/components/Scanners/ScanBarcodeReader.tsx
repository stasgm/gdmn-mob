import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { useIsFocused, useTheme } from '@react-navigation/native';
import { ISettingsOption } from '@lib/types';
import { useSelector } from '@lib/store';

import { IInventoryLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import { scanReader } from './scanReaderStyle';

interface IProps {
  onSave: (item: IInventoryLine) => void;
  onShowRemains: () => void;
  getScannedObject: (brc: string) => IInventoryLine | undefined;
}
export const ScanBarcodeReader = ({ onSave, onShowRemains, getScannedObject }: IProps) => {
  const ref = useRef<TextInput>(null);

  const settings = useSelector((state) => state.settings?.data);

  const weightSettingsWeightCode = (settings?.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings?.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings?.countWeight as ISettingsOption<number>).data || 0;

  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IInventoryLine>();

  const isFocused = useIsFocused();

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref?.current &&
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, 500);
    }
  }, [scanned, ref]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    }

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: IInventoryLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [
    barcode,
    scanned,
    vibroMode,
    weightSettingsWeightCode,
    weightSettingsCountCode,
    weightSettingsCountWeight,
    getScannedObject,
  ]);

  return isFocused ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[scanReader.content, { backgroundColor: colors.card }]}
    >
      <View style={scanReader.camera}>
        <View style={scanReader.header}>
          {/* <IconButton icon="arrow-left" color={'#FFF'} size={30} style={scanReader.transparent} onPress={onGoBack} /> */}
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={onShowRemains}
          />
        </View>
        {!scanned ? (
          <View style={[scanReader.scannerContainer, scanReader.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{ width: 0 }}
                autoFocus={true}
                ref={ref}
                showSoftInputOnFocus={false}
                onChangeText={(text) => handleBarCodeScanned(text)}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={scanReader.scannerContainer}>
            <View style={scanReader.buttonsContainer}>
              <TouchableOpacity
                style={[scanReader.buttons, scanReader.btnReScan]}
                onPress={() => {
                  setScanned(false);
                  setItemLine(undefined);
                }}
              >
                <IconButton icon="barcode-scan" size={30} />
                <Text style={scanReader.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !itemLine && (
              <View style={scanReader.infoContainer}>
                <View style={[scanReader.buttons, scanReader.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={scanReader.text}>{barcode}</Text>
                    <Text style={scanReader.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && (
              <View style={scanReader.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    scanReader.buttons,
                    itemLine.good.id === 'unknown' ? scanReader.btnUnknown : scanReader.btnFind,
                  ]}
                  onPress={() => {
                    onSave(itemLine);
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanReader.goodInfo}>
                    <Text style={scanReader.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={scanReader.barcode}>{itemLine?.barcode}</Text>
                    <Text style={scanReader.barcode}>
                      цена: {itemLine?.price || 0} р., остаток: {itemLine?.remains}
                    </Text>
                    <Text style={scanReader.barcode}>количество: {itemLine?.quantity}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanReader.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={scanReader.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  ) : (
    <></>
  );
};
