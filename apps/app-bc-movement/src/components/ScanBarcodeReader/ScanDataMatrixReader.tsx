import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { ONE_SECOND_IN_MS } from '../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (data: string) => void;
  onCancel: () => void;
}

const ScanDataMatrixReader = ({ onSave, onCancel }: IProps) => {
  const { colors } = useTheme();
  const [scanned, setScanned] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);

  const ref = useRef<TextInput>(null);

  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  const handleBarCodeScanned = (data: string) => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref.current.focus();
      ref.current.clear();
    }
  }, [scanned, ref]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.content, { backgroundColor: colors.card }]}
      focusable={true}
    >
      <View style={styles.camera}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" color={'#FFF'} size={30} style={styles.transparent} onPress={onCancel} />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                selectionColor={'#000'}
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
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={() => setScanned(false)}>
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && barcode && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, styles.btnReScan]}
                  onPress={() => {
                    onSave(barcode);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={styles.goodInfo}>
                    <Text style={styles.barcode}>{barcode}</Text>
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
  );
};

export default ScanDataMatrixReader;
