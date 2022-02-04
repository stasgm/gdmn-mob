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

import styles from './styles';

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
        }, ONE_SECOND_IN_MS);
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
      style={[styles.content, { backgroundColor: colors.card }]}
    >
      <View style={styles.camera}>
        <View style={styles.header}>
          {/* <IconButton icon="arrow-left" color={'#FFF'} size={30} style={scanReader.transparent} onPress={onGoBack} /> */}
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={styles.transparent}
            onPress={onShowRemains}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
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
          <View style={styles.scannerContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.buttons, styles.btnReScan]}
                onPress={() => {
                  setScanned(false);
                  setItemLine(undefined);
                }}
              >
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !itemLine && (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, itemLine.good.id === 'unknown' ? styles.btnUnknown : styles.btnFind]}
                  onPress={() => {
                    onSave(itemLine);
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={styles.goodInfo}>
                    <Text style={styles.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={styles.barcode}>{itemLine?.barcode}</Text>
                    <Text style={styles.barcode}>
                      цена: {itemLine?.price || 0} р., остаток: {itemLine?.remains}
                    </Text>
                    <Text style={styles.barcode}>количество: {itemLine?.quantity}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={styles.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  ) : (
    <></>
  );
};

export default ScanBarcodeReader;
