import { styles } from '@lib/mobile-navigation';
import { Checkbox, ItemSeparator, NumberKeypad } from '@lib/mobile-ui';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { INamedEntity } from '@lib/types';

import { IOrderLine, IPackageGood } from '../../../store/types';

import { ONE_SECOND_IN_MS } from '../../../utils/constants';
import { getLineUnitName, isLineQuantityInKg } from '../../../utils/helpers';

interface IProps {
  item: IOrderLine;
  packages: IPackageGood[];
  onSetLine: (value: IOrderLine) => void;
  isUseRemains?: boolean;
  isUseUnitMeasure?: boolean;
}

const OrderLine = ({ item, packages, onSetLine, isUseRemains = false, isUseUnitMeasure = true }: IProps) => {
  const { colors } = useTheme();
  const currRef = useRef<TextInput>(null);

  useEffect(() => {
    currRef?.current &&
      setTimeout(() => {
        currRef.current?.focus();
        Keyboard.dismiss();
      }, ONE_SECOND_IN_MS);
  }, []);

  // Если упаковка только одна, то ставим ее по умолчанию, иначе
  // если есть упаковка с признаком 'по умолчанию', то подставляем ее
  const defaultPack = useMemo(
    () => (packages?.length === 1 ? packages?.[0].package : packages?.find((i) => i.isDefault)?.package),
    [packages],
  );

  const [pack, setPack] = useState<INamedEntity | undefined>(item?.package || defaultPack);

  useEffect(() => {
    if (item.package?.id !== pack?.id) {
      onSetLine({ ...item, package: pack });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  const textStyle = [styles.number, styles.field, { color: colors.text, backgroundColor: 'transparent' }];
  const invWeight = item.good.invWeight || 1;
  const unitName = getLineUnitName(invWeight, item.good.valueName, isUseUnitMeasure, isUseRemains);
  const quantityLabel = isLineQuantityInKg(invWeight, isUseUnitMeasure, isUseRemains)
    ? 'Количество, кг'
    : `Количество, ${unitName}`;

  return (
    <View style={localStyles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={localStyles.containerScroll}>
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
        {typeof item.good.priceRed === 'number' ? (
          <>
            <View style={styles.item}>
              <View style={styles.details}>
                <Text style={styles.name}>Цена со скидкой</Text>
                <Text style={textStyle}>{item.good.priceRed}</Text>
              </View>
            </View>
            <ItemSeparator />
          </>
        ) : null}
        {item.good.scale ? (
          <>
            <View style={styles.item}>
              <View style={styles.details}>
                <Text style={styles.name}>Коэффициент перевода</Text>
                <Text style={textStyle}>{item.good.scale.toString()}</Text>
              </View>
            </View>
            <ItemSeparator />
          </>
        ) : null}
        <View style={localStyles.item}>
          <View style={styles.details}>
            <Text style={styles.name}>Упаковка</Text>
            {packages?.length > 0 ? (
              <View style={localStyles.packages}>
                {packages?.map((elem) => (
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
        {isUseRemains && (item.remains || item.remains === 0) ? (
          <>
            <View style={styles.item}>
              <View style={styles.details}>
                <Text style={styles.name}>Общий остаток</Text>
                <Text style={textStyle}>{item.remains || 0}</Text>
              </View>
            </View>
            <ItemSeparator />
          </>
        ) : null}
        {isUseRemains && (item.agentRemains || item.agentRemains === 0) ? (
          <>
            <View style={styles.item}>
              <View style={styles.details}>
                <Text style={styles.name}>Остаток по агенту</Text>
                <Text style={textStyle}>{item.agentRemains || 0}</Text>
              </View>
            </View>
            <ItemSeparator />
          </>
        ) : null}
        {isUseRemains && !!item?.good?.barcode && (
          <>
            <View style={styles.item}>
              <View style={styles.details}>
                <Text style={styles.name}>Баркод</Text>
                <Text style={textStyle}>{item.good.barcode}</Text>
              </View>
            </View>
            <ItemSeparator />
          </>
        )}
        <View style={styles.item}>
          <View style={styles.details}>
            <Text style={styles.name}>{quantityLabel}</Text>
            <TextInput
              style={[textStyle, localStyles.quantityItem]}
              showSoftInputOnFocus={false}
              caretHidden={true}
              ref={currRef}
              value={item.quantity.toString()}
            />
          </View>
        </View>
      </ScrollView>
      <NumberKeypad
        oldValue={item.quantity.toString()}
        onApply={(newValue) => onSetLine({ ...item, quantity: parseFloat(newValue) })}
        decDigitsForTotal={3}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 5,
  },
  containerScroll: {
    flexGrow: 1,
  },
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
    fontSize: 40,
  },
  pack: {
    marginVertical: 6,
  },
});

export default OrderLine;
