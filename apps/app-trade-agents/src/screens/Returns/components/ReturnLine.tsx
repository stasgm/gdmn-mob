import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  return (
    <>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>Наименование</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {item ? item.good.name || 'товар не найден' : ''}
              </Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>Цена</Text>
              <Text style={[styles.number, styles.field, { color: colors.text }]}>
                {item.priceFromSellBill?.toString()}
              </Text>
            </View>
          </View>
          <ItemSeparator />
          {item.quantityFromSellBill && (
            <>
              <View style={[styles.item, { backgroundColor: colors.background }]}>
                <View style={styles.details}>
                  <Text style={[styles.name, { color: colors.text }]}>Количество из накладной</Text>
                  <Text style={[styles.number, styles.field, { color: colors.text }]}>
                    {item.quantityFromSellBill.toString()}
                  </Text>
                </View>
              </View>
              <ItemSeparator />
            </>
          )}
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>Количество</Text>
              <TextInput
                style={[styles.number, styles.field, { color: colors.text }]}
                editable={true}
                ref={qtyRef}
                keyboardType="numeric"
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
