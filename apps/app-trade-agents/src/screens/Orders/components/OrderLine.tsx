import { styles } from '@lib/mobile-navigation';
import { ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { IOrderLine, IPackageGood } from '../../../store/types';

import Checkbox from './Checkbox';

interface IProps {
  item: IOrderLine;
  onSetLine: (value: IOrderLine) => void;
}

const OrderLine = ({ item, onSetLine }: IProps) => {
  const { colors } = useTheme();

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  const defaultPack = useMemo(
    () => (packages.length === 1 ? packages[0].package : packages.find((i) => i.isDefault)?.package),
    [packages],
  );

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString());
  const [pack, setPack] = useState<INamedEntity | undefined>(item?.package || defaultPack);

  const qtyRef = useRef<TextInput>(null);

  useEffect(() => {
    //TODO временное решение
    qtyRef?.current && setTimeout(() => qtyRef.current?.focus(), 1000);
  }, []);

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
    onSetLine({ ...item, quantity: parseFloat(goodQty) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  useEffect(() => {
    onSetLine({ ...item, package: pack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

  return (
    <>
      <ScrollView>
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
              <Text style={textStyle}>{item.good.priceFsn.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество, кг</Text>
              <TextInput
                style={textStyle}
                editable={true}
                keyboardType="numeric"
                autoCapitalize="words"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                ref={qtyRef}
                value={goodQty}
              />
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Упаковка</Text>
              {packages.length > 0 ? (
                <View style={localStyles.packages}>
                  {packages.map((elem) => (
                    <Checkbox
                      key={elem.package.id}
                      title={elem.package.name}
                      selected={elem.package.id === pack?.id}
                      onSelect={() => setPack(elem.package.id === pack?.id ? undefined : elem.package)}
                    />
                  ))}
                </View>
              ) : (
                <Text style={textStyle}>Для данного товара нет упаковки</Text>
              )}
            </View>
          </View>
          <ItemSeparator />
        </View>
      </ScrollView>
    </>
  );
};

const localStyles = StyleSheet.create({
  packages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default OrderLine;
