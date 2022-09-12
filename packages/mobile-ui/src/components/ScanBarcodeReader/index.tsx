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

import { IScannedObject } from '@lib/client-types';

import AppDialog from '../AppDialog';

import styles from './styles';

const ONE_SECOND_IN_MS = 1000;

interface IProps {
  scaner: IScannedObject;
  onSave?: () => void;
  onGetScannedObject: (brc: string) => void;
  onClearScannedObject: () => void;
  children?: ReactNode;
}

const ScanBarcodeReader = ({ scaner, onSave, onGetScannedObject, onClearScannedObject, children }: IProps) => {
  const ref = useRef<TextInput>(null);

  const [vibroMode, setVibroMode] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const scanned = scaner.state !== 'init' && !visibleDialog;

  const { colors } = useTheme();
  const viewStyle = useMemo(() => [styles.content, { backgroundColor: colors.card }], [colors.card]);

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

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

  useEffect(() => {
    if (scaner.state === 'found' && visibleDialog) {
      setVisibleDialog(false);
    }
  }, [scaner, visibleDialog]);

  const handleBarCodeScanned = (data: string) => {
    const brc = data.replace(']C1', '');
    setBarcode(brc);
    onGetScannedObject(brc);
  };

  const handleHideDialog = () => {
    setVisibleDialog(false);
    setBarcode('');
    onClearScannedObject();
  };

  const handlePressOkDialog = () => onGetScannedObject(barcode);

  const handleShowDialog = () => {
    setVisibleDialog(true);
    setBarcode('');
    onClearScannedObject();
  };

  const handleSave = () => {
    onSave && onSave();
  };

  const handleChangeText = (text: string) => {
    setBarcode(text);
    if (!text) {
      onClearScannedObject();
    }
  };

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
            onPress={handleShowDialog}
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
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={onClearScannedObject}>
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scaner.message ? (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{scaner.message}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.buttons, styles.btnFind]} onPress={handleSave}>
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  {children}
                </TouchableOpacity>
              </View>
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
      <AppDialog
        title="Введите штрих-код"
        visible={visibleDialog}
        text={barcode}
        onChangeText={handleChangeText}
        onCancel={handleHideDialog}
        onOk={handlePressOkDialog}
        okLabel={'Найти'}
        errorMessage={scaner.message}
      />
    </KeyboardAvoidingView>
  );
};

export default ScanBarcodeReader;
