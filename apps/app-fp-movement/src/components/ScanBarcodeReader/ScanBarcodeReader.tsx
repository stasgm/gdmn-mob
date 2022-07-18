import React, { useState, useEffect, useRef, useMemo } from 'react';
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

import { useFocusEffect, useIsFocused, useTheme } from '@react-navigation/native';

import { MediumText } from '@lib/mobile-ui';

import { IMoveLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import MoveTotal from '../../screens/Movements/components/MoveTotal';

import styles from './styles';

interface IProps {
  // onSave: (item: IMoveLine) => void;
  onSearchBarcode: () => void;
  getScannedObject: (brc: string) => IMoveLine | undefined;
  lines?: IMoveLine[];
}

export const ScanBarcodeReader = ({ /*onSave,*/ onSearchBarcode, getScannedObject, lines }: IProps) => {
  const ref = useRef<TextInput>(null);

  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  const { colors } = useTheme();
  const viewStyle = useMemo(() => [styles.content, { backgroundColor: colors.card }], [colors.card]);

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IMoveLine>();
  const [dubLicateLine, setDublicateLine] = useState<IMoveLine>();

  const isFocused = useIsFocused();

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

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
    if (scanned && itemLine) {
      // onSave(itemLine);
      setScanned(false);
      setItemLine(undefined);
    }
  }, [itemLine, /*onSave,*/ scanned]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    }

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: IMoveLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [barcode, scanned, vibroMode, getScannedObject]);

  return isFocused ? (
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
            onPress={onSearchBarcode}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={[{ width: 10 }]}
                autoFocus={true}
                selectionColor="transparent"
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
            {/* {scanned && itemLine && (
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
                  </View>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        )}
        {itemLine ? (
          <View style={{ marginHorizontal: 8, marginVertical: 5 }}>
            <MediumText>{itemLine?.good.name}</MediumText>
            <MediumText>{itemLine?.barcode}</MediumText>
          </View>
        ) : null}

        {lines?.length ? (
          // <View>
          //   <MediumText>Общий вес (кг): {lines?.length}</MediumText>
          //   <MediumText>Количество позиций: {lineSum?.weight}</MediumText>
          // </View>
          <MoveTotal lines={lines} scan={true} />
        ) : null}
        {!scanned && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={styles.text}>Отсканируйте штрихкод</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  ) : (
    <></>
  );
};

export default ScanBarcodeReader;
