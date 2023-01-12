import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Modal, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

import { styles } from '@lib/mobile-navigation';
import { ItemSeparator, NumberKeypad, ScanBarcode, ScanBarcodeReader } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import { IconButton } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { IScannedObject } from '@lib/client-types';

import { IMovementLine } from '../../../store/types';

import { ONE_SECOND_IN_MS } from '../../../utils/constants';

interface IProps {
  item: IMovementLine;
  onSetLine: (value: IMovementLine) => void;
}

export const DocLine = ({ item, onSetLine }: IProps) => {
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  const [goodEID, setGoodEID] = useState<string | undefined>(item?.EID?.toString());
  const [doScanned, setDoScanned] = useState(false);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });

  const currRef = useRef<TextInput>(null);

  const settings = useSelector((state) => state.settings.data);
  const isScanerReader = settings.scannerUse?.data as boolean;
  const isScreenKeyboard = settings.screenKeyboard?.data as boolean;

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(isScreenKeyboard);

  useEffect(() => {
    (isKeyboardOpen || currRef?.current) &&
      setTimeout(() => {
        currRef.current?.focus();
      }, ONE_SECOND_IN_MS);
  }, [isKeyboardOpen]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      Keyboard.dismiss();
      currRef.current?.focus();
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
    };
  }, []);

  const handleGetScannedObject = useCallback((brc: string) => {
    setScaner({ state: 'found' });
    if (!brc) {
      return;
    }
    setGoodEID(brc);

    setScaner({ state: 'init' });
    setDoScanned(false);
  }, []);

  const handleClearScaner = () => setScaner({ state: 'init' });

  const handleCancel = () => {
    setDoScanned(false);
    setScaner({ state: 'init' });
  };

  const handleDoScan = () => {
    setDoScanned(true);
  };

  useEffect(() => {
    onSetLine({ ...item, EID: goodEID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodEID]);

  const price = item?.price || 0;
  const remains = item?.remains || 0;
  const buyingPrice = item?.buyingPrice || 0;

  return (
    <>
      <Modal animationType="slide" visible={doScanned}>
        {isScanerReader ? (
          <ScanBarcodeReader
            onGetScannedObject={handleGetScannedObject}
            onClearScannedObject={handleClearScaner}
            scaner={scaner}
            isLeftButton={true}
            onCancel={handleCancel}
          />
        ) : (
          <ScanBarcode
            onGetScannedObject={handleGetScannedObject}
            onClearScannedObject={handleClearScaner}
            scaner={scaner}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.datamatrix]}
            isLeftButton={true}
            onCancel={handleCancel}
          />
        )}
      </Modal>
      <ScrollView keyboardShouldPersistTaps="never">
        <View style={styles.content}>
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Наименование</Text>
              <Text style={textStyle}>{item ? item.good.name || 'товар не найден' : ''}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Цена</Text>
              <Text style={textStyle}>{price.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Покупная цена</Text>
              <Text style={textStyle}>{buyingPrice.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Остаток</Text>
              <Text style={textStyle}>{remains.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={localStyles.details}>
              <View style={localStyles.new}>
                <Text style={styles.name}>EID</Text>
                <Text style={textStyle}>{item?.EID || 'Не указан'}</Text>
              </View>
              <View style={localStyles.button}>
                {item?.EID ? (
                  <TouchableOpacity>
                    <IconButton icon="close" size={20} onPress={() => setGoodEID(undefined)} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <IconButton icon="barcode-scan" size={30} onPress={handleDoScan} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={localStyles.details}>
              <View style={localStyles.new}>
                <Text style={styles.name}>Количество</Text>
                {/* <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}> */}
                <TextInput
                  autoFocus={true}
                  style={[textStyle, localStyles.quantitySize]}
                  showSoftInputOnFocus={false}
                  caretHidden={true}
                  keyboardType="numeric"
                  autoCapitalize="words"
                  onChangeText={(value) => onSetLine({ ...item, quantity: parseFloat(value || '0') })}
                  returnKeyType="done"
                  ref={currRef}
                  value={item.quantity.toString()}
                />
              </View>
              {isScreenKeyboard && (
                <View style={localStyles.button}>
                  <IconButton
                    icon={isKeyboardOpen ? 'pencil-remove-outline' : 'pencil-outline'}
                    onPress={() => setIsKeyboardOpen(!isKeyboardOpen)}
                    size={30}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {isScreenKeyboard && isKeyboardOpen && (
        <NumberKeypad
          oldValue={item.quantity.toString()}
          onApply={(value) => onSetLine({ ...item, quantity: parseFloat(value) })}
          decDigitsForTotal={3}
        />
      )}
    </>
  );
};

const localStyles = StyleSheet.create({
  button: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    zIndex: 5,
  },
  new: {
    width: '90%',
  },
  details: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
  },
  quantitySize: { fontSize: 40 },
});
