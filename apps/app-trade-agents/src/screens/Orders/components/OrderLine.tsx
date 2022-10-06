import { styles } from '@lib/mobile-navigation';
import { ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { IOrderLine, IPackageGood } from '../../../store/types';

import Checkbox from './Checkbox';

interface IProps {
  item: IOrderLine;
  onSetLine: (value: IOrderLine) => void;
}

const OrderLine = ({ item, onSetLine }: IProps) => {
  const theme = useTheme();

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  const qtyRef = useRef<TextInput>(null);

  useEffect(() => {
    //TODO временное решение
    qtyRef?.current &&
      setTimeout(() => {
        qtyRef.current?.focus();
        // handleMoveSelectionPress();
        // qtyRef.current?.setNativeProps({
        //   selection: {
        //     start: 1,
        //     // end: 1,
        //   },
        // });
      }, 1000);
  }, []);

  const handelQuantityChange = useCallback(
    (newValue: string) => {
      let value = newValue;
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      console.log('value', value);

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      console.log('validNumber', validNumber, validNumber.test(value), value, parseFloat(value));
      if (validNumber.test(value)) {
        onSetLine({ ...item, quantity: parseFloat(value) });
      }
    },
    [item, onSetLine],
  );

  const textStyle = [styles.number, styles.field, { color: theme.colors.text, blackgroundColor: 'transparent' }];
  const textPackStyle = [localStyles.text, { color: theme.colors.text }, { marginTop: 4 }];

  const handleMoveSelectionPress = () =>
    qtyRef.current?.setNativeProps({
      selection: {
        start: item.quantity.toString().length,
        // end: item.quantity.toString().length,
      },
    });

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: theme.colors.background }}>
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
              ref={qtyRef}
              value={item.quantity.toString()}
              defaultValue={'0'}
              style={textStyle}
              keyboardType="numeric"
              autoCapitalize="words"
              onChangeText={handelQuantityChange}
              returnKeyType="done"
            />
          </View>
        </View>
        <ItemSeparator />
        <View style={localStyles.item}>
          <View style={styles.details}>
            <Text style={styles.name}>Упаковка</Text>
            {packages.length > 0 ? (
              <View style={localStyles.packages}>
                {packages.map((elem) => (
                  <Checkbox
                    key={elem.package.id}
                    title={elem.package.name}
                    selected={elem.package.id === item.package?.id}
                    onSelect={() =>
                      onSetLine({ ...item, package: elem.package.id === item.package?.id ? undefined : elem.package })
                    }
                  />
                ))}
              </View>
            ) : (
              <Text style={textPackStyle}>Без упаковки</Text>
            )}
          </View>
        </View>
        <ItemSeparator />
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  packages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 3,
  },
});

export default OrderLine;
