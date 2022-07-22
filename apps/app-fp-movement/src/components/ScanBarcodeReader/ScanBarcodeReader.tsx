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

import { useFocusEffect, useTheme } from '@react-navigation/native';

import { MediumText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IMoveLine, ISellbillLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import styles from './styles';

export interface IScanerObject {
  item?: IMoveLine | ISellbillLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}
interface IProps {
  onSearchBarcode: () => void;
  getScannedObject: (brc: string) => void;
  // lines?: IMoveLine[];
  clearScan: () => void;
  scanObject: IScanerObject;
}

export const ScanBarcodeReader = ({ /*onSave,*/ onSearchBarcode, getScannedObject, scanObject, clearScan }: IProps) => {
  const ref = useRef<TextInput>(null);

  const [vibroMode, setVibroMode] = useState(false);
  // const [scanned, setScanned] = useState(false);

  const { colors } = useTheme();
  const viewStyle = useMemo(() => [styles.content, { backgroundColor: colors.card }], [colors.card]);

  // const [barcode, setBarcode] = useState('');
  const [key, setKey] = useState(1);
  // const [dubLicateLine, setDublicateLine] = useState<IMoveLine>();

  // const isFocused = useIsFocused();

  // const handleBarCodeScanned = (data: string) => {
  //   setScanned(true);
  //   setBarcode(data);
  // };

  useFocusEffect(
    React.useCallback(() => {
      if (scanObject.state === 'scan' && ref?.current) {
        ref?.current &&
          setTimeout(() => {
            ref.current?.focus();
            ref.current?.clear();
          }, ONE_SECOND_IN_MS);
      }
    }, [scanObject.state]),
  );

  // useEffect(() => {
  //   if (scanned && itemLine) {
  //     // onSave(itemLine);
  //     setScanned(false);
  //     setItemLine(undefined);
  //   }
  // }, [itemLine, /*onSave,*/ scanned]);

  // useEffect(() => {
  //   if (!scanned) {
  //     return;
  //   }

  //   if (!barcode && scanned) {
  //     setItemLine(undefined);
  //     return;
  //   }

  //   vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

  //   const scannedObj: IMoveLine | undefined = getScannedObject(barcode);
  //   if (scannedObj !== undefined) {
  //     setItemLine(scannedObj);
  //   }
  // }, [barcode, scanned, vibroMode, getScannedObject]);

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  const setScan = (brc: string) => {
    setKey(key + 1);
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    getScannedObject(brc);
    // setScanned(true);
  };

  return (
    //isFocused ?
    <KeyboardAvoidingView key={key} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={viewStyle}>
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
        {scanObject.item && (
          <View style={[{ backgroundColor: '#0008', padding: 10 }]}>
            {/* <MediumText style={styles.barcode}>Штрихкод: {scanObject.barcode}</MediumText> */}
            <MediumText style={styles.text}>{scanObject.item.good.name}</MediumText>
            <MediumText style={styles.textWhite}>№ партии: {scanObject.item.numReceived || ''}</MediumText>
            <MediumText style={styles.textWhite}>
              Дата производства: {getDateString(scanObject.item.workDate)}
            </MediumText>
            <MediumText style={styles.textWhite}>Вес: {scanObject.item.weight} кг.</MediumText>
          </View>
        )}
        {scanObject.state === 'scan' ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={[{ width: 10 }]}
                autoFocus={true}
                selectionColor="transparent"
                ref={ref}
                showSoftInputOnFocus={false}
                onChangeText={(text) => scanObject.state === 'scan' && setScan(text)}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        {scanObject.state === 'notFound' || scanObject.state === 'added' ? (
          <View style={styles.scannerContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={clearScan}>
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <MediumText style={styles.text}>Пересканировать</MediumText>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <View style={[styles.buttons, styles.btnNotFind]}>
                <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                <View>
                  {/* <MediumText style={styles.text}>{scanObject.barcode}</MediumText> */}
                  <MediumText style={styles.text}>
                    {scanObject.state === 'notFound' ? 'Товар не найден' : 'Товар уже добавлен'}
                  </MediumText>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {scanObject.state === 'scan' && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={styles.text}>Отсканируйте штрихкод</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
    // : (
    //   <></>
  );
};

export default ScanBarcodeReader;
