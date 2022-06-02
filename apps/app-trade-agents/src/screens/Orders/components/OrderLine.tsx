import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

import { IOrderLine, IPackageGood } from '../../../store/types';

import Checkbox from './Checkbox';

interface IProps {
  item: IOrderLine;
  onSetLine: (value: IOrderLine) => void;
}

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const OrderLine = ({ item, onSetLine }: IProps) => {
  const { colors } = useTheme();

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString());
  const [pack, setPack] = useState<INamedEntity | undefined>(item?.packagekey);
  const [isVisiblePackages, setIsVisiblePackages] = useState<boolean>(false);
  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

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
    onSetLine({ ...item, packagekey: pack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  const textStyle = useMemo(() => [styles.number, styles.field, { color: colors.text }], [colors.text]);

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
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Цена</Text>
              <Text style={textStyle}>{item.good.priceFsn.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество мест</Text>
              <TextInput
                style={textStyle}
                editable={true}
                keyboardType="numeric"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                ref={qtyRef}
                // autoFocus={isFocused}
                value={goodQty}
              />
            </View>
          </View>
          <ItemSeparator />
          {packages.length > 0 ? (
            <>
              <TouchableOpacity style={styles.item} onPress={() => setIsVisiblePackages(!isVisiblePackages)}>
                <View style={styles.details}>
                  <Text style={styles.name}>Упаковка</Text>
                  <Text style={textStyle}>{pack ? pack.name || 'упаковка не найдена' : ''}</Text>
                </View>
                <MaterialCommunityIcons
                  name={(isVisiblePackages ? 'chevron-up' : 'chevron-down') as Icon}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <View>
                {isVisiblePackages && (
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
                )}
              </View>
            </>
          ) : (
            <>
              <View style={localStyles.item}>
                <View style={localStyles.details}>
                  <Text style={styles.name}>Упаковка</Text>
                  <Text style={[styles.number, styles.field]}>{pack ? pack.name || 'упаковка не найдена' : ''}</Text>
                </View>
                <MaterialCommunityIcons name={'chevron-down' as Icon} size={24} color="black" />
              </View>
              <Text style={localStyles.text}>Для данного товара нет упаковки</Text>
            </>
          )}
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
  details: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 5,
  },
});

export default OrderLine;
