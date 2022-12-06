import { styles } from '@lib/mobile-navigation';
import { ItemSeparator, QuantityInput } from '@lib/mobile-ui';

import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { INamedEntity } from '@lib/types';

import { IOrderLine, IPackageGood } from '../../../store/types';

import Checkbox from './Checkbox';

interface IProps {
  visibleQuantityInput: boolean;
  item: IOrderLine;
  packages: IPackageGood[];
  onSetLine: (value: IOrderLine) => void;
}

const OrderLine = ({ item, packages, onSetLine, visibleQuantityInput }: IProps) => {
  const { colors } = useTheme();
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    // TODO временное решение
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  }, [inputRef]);

  // Если упаковка только одна, то ставим ее по умолчанию, иначе
  // если есть упаковка с признаком 'по умолчанию', то подставляем ее
  const defaultPack = useMemo(
    () => (packages.length === 1 ? packages[0].package : packages.find((i) => i.isDefault)?.package),
    [packages],
  );

  const [pack, setPack] = useState<INamedEntity | undefined>(item?.package || defaultPack);

  useEffect(() => {
    if (item.package?.id !== pack?.id) {
      onSetLine({ ...item, package: pack });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  const textStyle = [styles.number, styles.field, { color: colors.text, blackgroundColor: 'transparent' }];

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: colors.background }}>
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
            <Text style={textStyle}>{item.good.priceFsn}</Text>
          </View>
        </View>
        <ItemSeparator />
        <View style={styles.item}>
          <View style={styles.details}>
            <Text style={styles.name}>Количество, кг</Text>
            {visibleQuantityInput ? (
              <QuantityInput
                inputRef={inputRef}
                value={item.quantity.toString()}
                onChangeText={(newValue) => onSetLine({ ...item, quantity: parseFloat(newValue) })}
              />
            ) : (
              <View style={localStyles.quantityItem} />
            )}
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
                    onSelect={() => setPack(elem.package.id === pack?.id ? undefined : elem.package)}
                  />
                ))}
              </View>
            ) : (
              <Text style={[textStyle, localStyles.pack]}>Без упаковки</Text>
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
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 3,
  },
  quantityItem: {
    height: 28,
  },
  pack: {
    marginVertical: 6,
  },
});

export default OrderLine;
