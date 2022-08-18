import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

import { styles } from '@lib/mobile-navigation';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import { IconButton } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { IMovementLine } from '../store/types';

import { ONE_SECOND_IN_MS } from '../utils/constants';

import { ScanDataMatrix, ScanDataMatrixReader } from '.';

interface IProps {
  item: IMovementLine;
  onSetLine: (value: IMovementLine) => void;
}

export const DocLine = ({ item, onSetLine }: IProps) => {
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString());
  const [goodEID, setGoodEID] = useState<string | undefined>(item?.EID?.toString());
  const [doScanned, setDoScanned] = useState(false);

  const currRef = useRef<TextInput>(null);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), ONE_SECOND_IN_MS);
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setGoodQty((prev) => {
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  }, []);

  const handleEIDScanned = (data: string) => {
    setDoScanned(false);
    setGoodEID(data);
  };

  const handleDoScan = () => {
    setDoScanned(true);
  };

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty), EID: goodEID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty, goodEID]);

  const price = item?.price || 0;
  const remains = item?.remains || 0;
  const buyingPrice = item?.buyingPrice || 0;

  return (
    <>
      <Modal animationType="slide" visible={doScanned}>
        {isScanerReader ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item]}>
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
                {item?.EID && (
                  <TouchableOpacity>
                    <IconButton icon="close" size={20} onPress={() => setGoodEID(undefined)} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество</Text>
              <TextInput
                style={[styles.number, styles.field]}
                editable={true}
                keyboardType="numeric"
                autoCapitalize="words"
                onChangeText={handleQuantityChange}
                returnKeyType="done"
                ref={currRef}
                value={goodQty}
              />
            </View>
          </View>
          <View>
            <PrimeButton icon="barcode-scan" onPress={handleDoScan}>
              Сканировать EID
            </PrimeButton>
          </View>
        </View>
      </ScrollView>
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
});
