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
  onErrorSave?: () => void;
  isErrorTouchable?: boolean;
  onGetScannedObject: (brc: string) => void;
  onClearScannedObject: () => void;
  children?: ReactNode;
  onSearch?: () => void;
  isLeftButton?: boolean;
  onCancel?: () => void;
}

const ScanBarcodeReader = ({
  scaner,
  isErrorTouchable = false,
  onSave,
  onErrorSave,
  onGetScannedObject,
  onClearScannedObject,
  children,
  onSearch,
  isLeftButton,
  onCancel,
}: IProps) => {
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

  const handleErrorSave = () => {
    onErrorSave && onErrorSave();
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
          {isLeftButton ? (
            <IconButton icon="arrow-left" iconColor={'#FFF'} size={30} style={styles.transparent} onPress={onCancel} />
          ) : null}
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            size={30}
            iconColor={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            size={30}
            iconColor={'#FFF'}
            style={styles.transparent}
            onPress={onSearch ? onSearch : handleShowDialog}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.scanFocusWithWidth}
                selectionColor="transparent"
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
                <IconButton icon="barcode-scan" iconColor={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scaner.message ? (
              <View style={styles.infoContainer}>
                <TouchableOpacity onPress={handleErrorSave} disabled={!isErrorTouchable}>
                  <View style={[styles.buttons, styles.btnNotFind]}>
                    <IconButton icon={'information-outline'} iconColor={'#FFF'} size={30} />
                    <View>
                      <Text style={styles.text}>{barcode}</Text>
                      <Text style={styles.text}>{scaner.message}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, scaner.state === 'error' ? styles.btnNotFind : styles.btnFind]}
                  onPress={handleSave}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} iconColor={'#FFF'} size={30} />
                  {children}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} iconColor={'#FFF'} size={40} />
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
