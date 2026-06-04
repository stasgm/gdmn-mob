import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Modal, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

import { styles } from '@lib/mobile-navigation';
import {
  ItemSeparator,
  LargeText,
  MediumText,
  NumberKeypad,
  ScanBarcode,
  ScanBarcodeReader,
  globalStyles,
} from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import { IconButton } from 'react-native-paper';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { IScannedObject } from '@lib/client-types';

import { ISettingsOption } from '@lib/types';

import { IInvoiceLine } from '../../../store/types';

import { ONE_SECOND_IN_MS } from '../../../utils/constants';
import { getDataMarkType } from '../../../utils/helpers';

interface IQuantity {
  quantity?: string;
  sumWNds?: string;
}

interface IProps {
  item: IInvoiceLine;
  onSetLine: (value: IInvoiceLine) => void;
  onSetDisabledSave?: (value: boolean) => void;
  isSumWNds?: boolean;
}

export const InvoiceLine = ({ item, onSetLine }: IProps) => {
  // const { colors } = useTheme();

  const [goodEID, setGoodEID] = useState<string[]>(item?.eidList?.length ? item?.eidList : []);
  const [doScanned, setDoScanned] = useState(false);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });

  const currRef = useRef<TextInput>(null);

  const settings = useSelector((state) => state.settings.data);
  const isScanerReader = settings.scannerUse?.data as boolean;
  const isScreenKeyboard = settings.screenKeyboard?.data as boolean;

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(isScreenKeyboard);

  const [changeOldValue, setChangeOldValue] = useState(true);

  useEffect(() => {
    (isKeyboardOpen || currRef?.current) &&
      setTimeout(() => {
        currRef.current?.focus();
      }, ONE_SECOND_IN_MS);
  }, [isKeyboardOpen]);

  useEffect(() => {
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
    };
  }, []);

  const handleGetScannedObject = useCallback(
    (brc: string) => {
      setScaner({ state: 'found' });
      const prefixGtin = (settings.prefixGtin as ISettingsOption<string>)?.data || '';
      const prefixISN = (settings.prefixISN as ISettingsOption<string>)?.data || '';
      const dataMarkType = getDataMarkType(brc, prefixGtin, prefixISN);

      if (!brc) {
        setScaner({ state: 'error', message: 'Штрихкод не отсканирован' });

        return;
      }

      if (dataMarkType === '0') {
        setScaner({ state: 'error', message: 'Ошибка!' });

        return;
      }

      const lineBrc = goodEID.find((i) => i === brc);
      if (lineBrc) {
        setScaner({ state: 'error', message: 'Код маркировки уже добавлен' });

        return;
      }

      if (dataMarkType === '1') {
        if (item?.eidType !== '1' && item?.eidType !== '3') {
          setScaner({ state: 'error', message: 'Отсканирован неправильный код маркировки.' });
          return;
        }
        const gtin = brc.match(RegExp(`${prefixGtin}0?\\d{13}${prefixISN}`));

        if (!gtin || (gtin[0].slice(2, -2) !== item?.barcode && gtin[0].slice(3, -2) !== item?.barcode)) {
          setScaner({ state: 'error', message: 'Коды товаров не совпадают.' });
          return;
        }
      }

      setGoodEID([...goodEID, brc]);

      setScaner({ state: 'init' });
      setDoScanned(false);
      handleClearScaner();
    },
    [goodEID, item?.barcode, item?.eidType, settings.prefixGtin, settings.prefixISN],
  );

  const handleClearScaner = () => setScaner({ state: 'init' });

  const handleCancel = () => {
    setDoScanned(false);
    setScaner({ state: 'init' });
  };

  const handleDoScan = () => {
    if (keypadValue.quantity && Number(keypadValue.quantity) === goodEID.length) {
      return;
    }
    setDoScanned(true);
  };

  useEffect(() => {
    onSetLine({ ...item, eidList: goodEID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodEID]);

  const price = item?.price || 0;
  const barcode = item?.barcode || '';

  const [keypadValue, setKeypadValue] = useState<IQuantity>({ quantity: item.quantity.toString() });

  const getValue = useCallback((obj: any, value?: string | number) => {
    return { ...obj, quantity: value };
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      if (isKeyboardOpen) {
        setIsKeyboardOpen(false);
      }
      setChangeOldValue(false);
      let newValue = text.replace(',', '.');
      newValue = !newValue.includes('.') ? parseFloat(newValue).toString() : newValue;
      newValue = Number.isNaN(parseFloat(newValue)) ? '0' : newValue;
      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      const q = validNumber.test(newValue) ? newValue : keypadValue.quantity;
      setKeypadValue(getValue(keypadValue, q));
      onSetLine(getValue({ ...item, keypadValue }, parseFloat(q || '0')));
    },
    [isKeyboardOpen, keypadValue, getValue, onSetLine, item],
  );

  const oldValue = useMemo(() => keypadValue.quantity, [keypadValue]);

  const contentStyle = useMemo(
    () =>
      ({
        flexDirection: 'column',
        justifyContent: isKeyboardOpen ? 'space-between' : 'flex-start',
        flex: 1,
      }) as any,
    [isKeyboardOpen],
  );

  return (
    <View style={contentStyle}>
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
            barCodeTypes={['datamatrix']}
            isLeftButton={true}
            onCancel={handleCancel}
          />
        )}
      </Modal>
      <ScrollView keyboardShouldPersistTaps="handled" style={localStyles.flexGrow0}>
        <View style={styles.container}>
          <View style={localStyles.item}>
            <View>
              <LargeText style={globalStyles.textBold}>{item ? item.good.name || 'товар не найден' : ''}</LargeText>
              {barcode ? <MediumText>{barcode}</MediumText> : null}
            </View>
          </View>
          <ItemSeparator />

          <View style={localStyles.item}>
            <View style={localStyles.eIdView}>
              <MediumText>Цена:</MediumText>
              <LargeText style={localStyles.value}>{price.toString()}</LargeText>
            </View>
          </View>

          <ItemSeparator />

          <View style={localStyles.item}>
            <View style={localStyles.eIdView}>
              <MediumText>{'Штрихкод'}</MediumText>
              <LargeText style={localStyles.value}>{item?.barcode || ''}</LargeText>
            </View>
          </View>

          <ItemSeparator />
          <View style={localStyles.item}>
            <View style={localStyles.eIdView}>
              <MediumText>EID:</MediumText>
              <View style={localStyles.eidList}>
                {item?.eidList?.map((i, index) => (
                  <LargeText key={index} style={localStyles.value}>
                    {i}
                  </LargeText>
                ))}
              </View>
            </View>
            <View style={localStyles.button}>
              {/* {item?.EID ? (
                <TouchableOpacity>
                  <IconButton icon="close" size={20} onPress={() => setGoodEID([])} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <IconButton icon="barcode-scan" size={24} onPress={handleDoScan} />
                </TouchableOpacity>
              )} */}
              {/* {item?.EIDlist?.length ? (
                <TouchableOpacity>
                  <IconButton icon="close" size={20} onPress={() => setGoodEID([])} />
                </TouchableOpacity>
              ) : ( */}
              <TouchableOpacity>
                <IconButton icon="barcode-scan" size={24} onPress={handleDoScan} />
              </TouchableOpacity>
              {/* )} */}
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <View style={localStyles.quant}>
          <ItemSeparator />
          <View style={localStyles.item}>
            <MediumText>{'Количество:'}</MediumText>
            <TextInput
              style={localStyles.quantitySize}
              showSoftInputOnFocus={false}
              caretHidden={true}
              keyboardType="numeric"
              autoCapitalize="words"
              onChangeText={handleChangeText}
              returnKeyType="done"
              ref={currRef}
              value={keypadValue.quantity}
            />
          </View>
          {isScreenKeyboard && (
            <View style={[localStyles.button, localStyles.zIndex]}>
              <IconButton
                icon={isKeyboardOpen ? 'keyboard-off-outline' : 'keyboard-outline'}
                onPress={() => setIsKeyboardOpen(!isKeyboardOpen)}
                size={24}
              />
            </View>
          )}
        </View>
        {isScreenKeyboard && isKeyboardOpen && (
          <NumberKeypad
            oldValue={oldValue}
            onApply={(value) => {
              onSetLine(getValue(item, parseFloat(value)));
              setKeypadValue(getValue(keypadValue, value));
            }}
            decDigitsForTotal={3}
            changeOldValue={changeOldValue}
          />
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: -5,
    zIndex: 5,
  },
  item: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  // halfItem: {
  //   flexDirection: 'row',
  //   width: '50%',
  //   paddingRight: 3,
  //   alignSelf: 'flex-start',
  //   flexWrap: 'wrap',
  //   alignItems: 'center',
  // },
  value: {
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  // verticalLine: {
  //   width: 1,
  //   height: '100%',
  // },
  // halfItemRemView: {
  //   marginLeft: 3,
  // },
  eIdView: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
  },
  quantitySize: {
    fontSize: 30,
    paddingLeft: 5,
  },
  flexGrow0: {
    flexGrow: 0,
  },
  quant: {
    marginHorizontal: 5,
  },
  zIndex: { zIndex: 0 },
  eidList: { flexDirection: 'column' },
});
