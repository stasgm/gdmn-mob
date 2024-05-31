import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Modal, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

import { styles } from '@lib/mobile-navigation';
import {
  AppDialog,
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

import { useTheme } from '@react-navigation/native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { IScannedObject } from '@lib/client-types';

import { IMovementLine } from '../../../store/types';

import { ONE_SECOND_IN_MS } from '../../../utils/constants';

interface IQuantity {
  quantity?: string;
  sumWNds?: string;
}

interface IProps {
  item: IMovementLine;
  onSetLine: (value: IMovementLine) => void;
  onSetDisabledSave: (value: boolean) => void;
  isSumWNds?: boolean;
}

export const DocLine = ({ item, isSumWNds, onSetLine, onSetDisabledSave }: IProps) => {
  const { colors } = useTheme();

  const [goodEID, setGoodEID] = useState<string | undefined>(item?.EID?.toString());
  const [doScanned, setDoScanned] = useState(false);

  const [goodName, setGoodName] = useState<string>(item?.good.name || '');
  const [visibleDialog, setVisibleDialog] = useState(false);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });

  const currRef = useRef<TextInput>(null);

  const settings = useSelector((state) => state.settings.data);
  const isScanerReader = settings.scannerUse?.data as boolean;
  const isScreenKeyboard = settings.screenKeyboard?.data as boolean;

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(isScreenKeyboard);

  const [isQuantity, setIsQuantity] = useState(true);
  const [changeOldValue, setChangeOldValue] = useState(true);

  useEffect(() => {
    !visibleDialog &&
      (isKeyboardOpen || currRef?.current) &&
      setTimeout(() => {
        currRef.current?.focus();
      }, ONE_SECOND_IN_MS);
  }, [isKeyboardOpen, visibleDialog]);

  useEffect(() => {
    if (!visibleDialog) {
      Keyboard.addListener('keyboardDidShow', () => {
        Keyboard.dismiss();
        currRef.current?.focus();
      });
    }
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
    };
  }, [visibleDialog]);

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

  const handleAddName = () => {
    onSetLine({ ...item, good: { ...item.good, name: goodName } });
    setVisibleDialog(false);
  };

  useEffect(() => {
    onSetLine({ ...item, EID: goodEID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodEID]);

  useEffect(() => {
    onSetDisabledSave(visibleDialog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleDialog]);

  const price = item?.price || 0;
  const remains = item?.remains || 0;
  const buyingPrice = item?.buyingPrice || 0;
  const barcode = item?.barcode || '';

  const [keypadValue, setKeypadValue] = useState<IQuantity>({ quantity: item.quantity.toString() });

  const getValue = useCallback(
    (obj: any, value?: string | number) => {
      return isQuantity ? { ...obj, quantity: value } : { ...obj, sumWNds: value };
    },
    [isQuantity],
  );

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
      const q = validNumber.test(newValue) ? newValue : isQuantity ? keypadValue.quantity : keypadValue.sumWNds;
      setKeypadValue(getValue(keypadValue, q));
      onSetLine(getValue(keypadValue, parseFloat(q || '0')));
    },
    [isKeyboardOpen, isQuantity, keypadValue, getValue, onSetLine],
  );

  const handleChangeQuantity = useCallback(() => {
    setIsQuantity(!isQuantity);
    setChangeOldValue(true);
    setKeypadValue(getValue(keypadValue, (isQuantity ? item.quantity : item.sumWNds || 0).toString()));
  }, [getValue, isQuantity, item.quantity, item.sumWNds, keypadValue]);

  const oldValue = useMemo(() => (isQuantity ? keypadValue.quantity : keypadValue.sumWNds), [isQuantity, keypadValue]);
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
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.datamatrix]}
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
            {item.good.id === 'unknown' && (
              <View style={localStyles.button}>
                <TouchableOpacity>
                  <IconButton icon="pencil-outline" size={24} onPress={() => setVisibleDialog(true)} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ItemSeparator />
          {item.alias || item.weightCode ? (
            <View>
              <View style={localStyles.item}>
                <View style={localStyles.halfItem}>
                  <MediumText>Арт.:</MediumText>
                  <LargeText style={localStyles.value}>{item.alias || ''}</LargeText>
                </View>
                <View style={[{ backgroundColor: colors.primary }, localStyles.verticalLine]} />
                <View style={[localStyles.halfItem, localStyles.halfItemRemView]}>
                  <MediumText>Вес. код: </MediumText>
                  <LargeText style={localStyles.value}>{item.weightCode || ''}</LargeText>
                </View>
              </View>
              <ItemSeparator />
            </View>
          ) : null}
          <View style={localStyles.item}>
            <View style={localStyles.halfItem}>
              <MediumText>Цена:</MediumText>
              <LargeText style={localStyles.value}>{price.toString()}</LargeText>
            </View>
            <View style={[{ backgroundColor: colors.primary }, localStyles.verticalLine]} />
            <View style={[localStyles.halfItem, localStyles.halfItemRemView]}>
              <MediumText>Остаток:</MediumText>
              <LargeText style={localStyles.value}>{remains.toString()}</LargeText>
            </View>
          </View>
          <ItemSeparator />

          {isSumWNds ? (
            <View style={localStyles.item}>
              <View style={localStyles.eIdView}>
                <MediumText>{isQuantity ? 'Сумма с НДС:' : 'Количество:'}</MediumText>
                <LargeText style={localStyles.value}>
                  {isQuantity ? item?.sumWNds?.toString() || '0' : item?.quantity?.toString() || '0'}
                </LargeText>
              </View>
              <View style={localStyles.button}>
                <TouchableOpacity>
                  <IconButton icon="pencil-outline" size={24} onPress={handleChangeQuantity} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={localStyles.item}>
              <MediumText>Покупная цена:</MediumText>
              <LargeText style={localStyles.value}>{buyingPrice.toString()}</LargeText>
            </View>
          )}

          <ItemSeparator />
          <View style={localStyles.item}>
            <View style={localStyles.eIdView}>
              <MediumText>EID:</MediumText>
              <LargeText style={localStyles.value}>{item?.EID}</LargeText>
            </View>
            <View style={localStyles.button}>
              {item?.EID ? (
                <TouchableOpacity>
                  <IconButton icon="close" size={20} onPress={() => setGoodEID(undefined)} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <IconButton icon="barcode-scan" size={24} onPress={handleDoScan} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <View style={localStyles.quant}>
          <ItemSeparator />
          <View style={localStyles.item}>
            <MediumText>{isQuantity ? 'Количество:' : 'Сумма с НДС:'}</MediumText>
            <TextInput
              style={localStyles.quantitySize}
              showSoftInputOnFocus={false}
              caretHidden={true}
              keyboardType="numeric"
              autoCapitalize="words"
              onChangeText={handleChangeText}
              returnKeyType="done"
              ref={currRef}
              value={isQuantity ? keypadValue.quantity : keypadValue.sumWNds}
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
      <AppDialog
        title="Наименование"
        visible={visibleDialog}
        text={goodName || ''}
        onChangeText={setGoodName}
        onCancel={() => setVisibleDialog(false)}
        onOk={handleAddName}
        okLabel={'Сохранить'}
        okDisabled={goodName ? false : true}
      />
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
  halfItem: {
    flexDirection: 'row',
    width: '50%',
    paddingRight: 3,
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  halfItemRemView: {
    marginLeft: 3,
  },
  eIdView: {
    flexDirection: 'row',
    width: '80%',
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
});
