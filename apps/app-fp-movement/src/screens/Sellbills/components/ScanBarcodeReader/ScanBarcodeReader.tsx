import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
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

import { useFocusEffect, useTheme } from '@react-navigation/native';

import { IOrderDocument } from '../../../../store/types';
import { ONE_SECOND_IN_MS } from '../../../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (item: IOrderDocument) => void;
  onShowSearchDialog: () => void;
  getScannedObject: (brc: string) => void;
  scannedObject: IOrderDocument | undefined;
  errorMessage?: string;
  children?: ReactNode;
}

const ScanBarcodeReader = ({
  onSave,
  onShowSearchDialog,
  getScannedObject,
  scannedObject,
  errorMessage,
  children,
}: IProps) => {
  const ref = useRef<TextInput>(null);

  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  const { colors } = useTheme();
  const viewStyle = useMemo(() => [styles.content, { backgroundColor: colors.card }], [colors.card]);

  const [barcode, setBarcode] = useState('');

  const handleBarCodeScanned = (data: string) => {
    const brc = data.replace(']C1', '');
    setScanned(true);
    setBarcode(brc);
    getScannedObject(brc);
  };

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  useEffect(() => {
    if (scannedObject || errorMessage) {
      setScanned(true);
    }
  }, [errorMessage, scannedObject]);

  useFocusEffect(
    React.useCallback(() => {
      if (!scanned && ref?.current) {
        ref?.current &&
          setTimeout(() => {
            ref.current?.focus();
            ref.current?.clear();
          }, ONE_SECOND_IN_MS);
      }
    }, [scanned, ref]),
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={viewStyle}>
      <View style={styles.camera}>
        <View style={styles.header}>
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            size={30}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            size={30}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => {
              setScanned(false);
              onShowSearchDialog();
            }}
          />
        </View>
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
                }}
              >
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{'Заявка не найдена'}</Text>
                  </View>
                </View>
              </View>
            ) : (
              scannedObject && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, styles.btnFind]}
                    onPress={() => {
                      onSave(scannedObject);
                      setScanned(false);
                    }}
                  >
                    <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                    {children}
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={styles.text}>Отсканируйте штрихкод</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ScanBarcodeReader;
