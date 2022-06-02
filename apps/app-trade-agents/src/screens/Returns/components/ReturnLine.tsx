import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';

import { IReturnLine } from '../../../store/types';

interface IProps {
  item: IReturnLine;
  onSetLine: (value: IReturnLine) => void;
}

const ReturnLine = ({ item, onSetLine }: IProps) => {
  const [goodQty, setGoodQty] = useState<string>(item.quantity.toString());

  const { colors } = useTheme();

  const handelQuantityChange = useCallback((value: string) => {
    setGoodQty((prev) => {
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  }, []);

  useEffect(() => {
    //TODO временное решение
    qtyRef?.current && setTimeout(() => qtyRef.current?.focus(), 1000);
  }, []);

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty) });
    //TODO Исправить
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  const qtyRef = useRef<TextInput>(null);

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);
  const viewStyle = useMemo(() => [styles.item, { backgroundColor: colors.background }], [colors.background]);

  return (
    <>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item]}>
            <View style={styles.details}>
              <Text style={styles.name}>Наименование</Text>
              <Text style={textStyle}>{item ? item.good.name || 'товар не найден' : ''}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={viewStyle}>
            <View style={styles.details}>
              <Text style={styles.name}>Цена</Text>
              <Text style={textStyle}>{item.priceFromSellBill?.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          {item.quantityFromSellBill && (
            <>
              <View style={viewStyle}>
                <View style={styles.details}>
                  <Text style={styles.name}>Количество из накладной</Text>
                  <Text style={textStyle}>{item.quantityFromSellBill.toString()}</Text>
                </View>
              </View>
              <ItemSeparator />
            </>
          )}
          <View style={viewStyle}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество</Text>
              <TextInput
                style={textStyle}
                editable={true}
                ref={qtyRef}
                keyboardType="numeric"
                autoCapitalize="none"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                autoFocus={true}
                value={goodQty}
              />
            </View>
          </View>
        </View>
        <ItemSeparator />
      </ScrollView>
    </>
  );
};

export default ReturnLine;
