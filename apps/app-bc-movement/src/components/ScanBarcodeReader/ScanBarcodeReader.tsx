import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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

import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';

import { IMovementLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import { MovementStackParamList } from '../../navigation/Root/types';

import styles from './styles';

interface IProps {
  onSave: (item: IMovementLine) => void;
  getScannedObject: (brc: string) => IMovementLine | undefined;
}

export const ScanBarcodeReader = ({ onSave, getScannedObject }: IProps) => {
  const ref = useRef<TextInput>(null);

  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'ScanBarcode'>>();

  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IMovementLine>();

  const isFocused = useIsFocused();

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={vibroMode ? 'vibrate' : 'vibrate-off'}
          // color={'#FFF'}
          style={styles.transparent}
          onPress={() => setVibroMode(!vibroMode)}
        />
      ),
    });
  }, [navigation, vibroMode]);

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

    const scannedObj: IMovementLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [barcode, scanned, vibroMode, getScannedObject]);

  return isFocused ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.content, { backgroundColor: colors.card }]}
    >
      <View style={styles.camera}>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.scanFocus}
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
            {scanned && itemLine?.barcode === '-1' && (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.error}>{'Данный штрихкод уже существует'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && itemLine?.barcode !== '-1' && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, styles.btnFind]}
                  onPress={() => {
                    onSave(itemLine);
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
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
