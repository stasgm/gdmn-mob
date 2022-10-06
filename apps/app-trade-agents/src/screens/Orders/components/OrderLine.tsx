import { styles } from '@lib/mobile-navigation';
import { ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput as RNTextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { TextInput } from 'react-native-paper';

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

  const qtyRef = useRef<RNTextInput>(null);

  useEffect(() => {
    //TODO временное решение
    qtyRef?.current &&
      setTimeout(() => {
        qtyRef.current?.focus();
      }, 1000);
  }, []);

  const handelQuantityChange = useCallback(
    (newValue: string) => {
      let value = newValue;
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      onSetLine({ ...item, quantity: validNumber.test(value) ? parseFloat(value) : item.quantity });
    },
    [item, onSetLine],
  );

  const textStyle = [styles.number, styles.field, { color: theme.colors.text, backgroundColor: 'transparent' }];
  const textPackStyle = [localStyles.text, { color: theme.colors.text }, { marginTop: 4 }];

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
          <View style={localStyles.itemQuantity}>
            <Text style={styles.name}>Количество, кг</Text>
            <TextInput
              ref={qtyRef}
              value={item.quantity.toString()}
              defaultValue={'0'}
              style={[textStyle, localStyles.textQuantity]}
              keyboardType="numeric"
              autoCapitalize="words"
              onChangeText={handelQuantityChange}
              returnKeyType="done"
              underlineColor="transparent"
              theme={{ ...theme, colors: { ...theme.colors, primary: 'transparent' } }}
              selectionColor={theme.colors.primary}
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
  itemQuantity: {
    flex: 1,
  },
  textQuantity: {
    height: 40,
  },
});

export default OrderLine;
