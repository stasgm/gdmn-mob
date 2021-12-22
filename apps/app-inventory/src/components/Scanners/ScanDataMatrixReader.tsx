/* eslint-disable react-native/no-inline-styles */
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

import { scanStyle } from '@lib/mobile-ui/src/styles/scanStyle';

const oneSecond = 1000;

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
    vibroMode && Vibration.vibrate(oneSecond);
  }, [vibroMode]);

  const handleBarCodeScanned = (data: string) => {
    vibroMode && Vibration.vibrate(oneSecond);
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
      style={[scanStyle.content, { backgroundColor: colors.card }]}
      focusable={true}
    >
      <View style={scanStyle.camera}>
        <View style={scanStyle.header}>
          <IconButton icon="arrow-left" color={'#FFF'} size={30} style={scanStyle.transparent} onPress={onCancel} />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={scanStyle.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
        </View>
        {!scanned ? (
          <View style={[scanStyle.scannerContainer, { alignItems: 'center' }]}>
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
          <View style={scanStyle.scannerContainer}>
            <View style={scanStyle.buttonsContainer}>
              <TouchableOpacity
                style={[scanStyle.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={scanStyle.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && barcode && (
              <View style={scanStyle.buttonsContainer}>
                <TouchableOpacity
                  style={[scanStyle.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    onSave(barcode);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanStyle.goodInfo}>
                    <Text style={scanStyle.barcode}>{barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanStyle.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={scanStyle.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export { ScanDataMatrixReader };
