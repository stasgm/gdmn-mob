import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { useIsFocused, useTheme } from '@react-navigation/native';

import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, View, Text } from 'react-native';

import { IOrderLine } from '../../../store/docs/types';

const OrderLine = ({ item }: { item: IOrderLine | undefined }) => {
  const [goodQty, setGoodQty] = useState<string>('1');
  const isFocused = useIsFocused();

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

  const priceFSN = useMemo(() => {
    return 2;
    // return ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId)?.pricefsn || 0;
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={[styles.item, { backgroundColor: colors.background }]}>
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
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{priceFSN.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={[styles.item, { backgroundColor: colors.background }]}>
            <View style={styles.details}>
              <Text style={[styles.name, { color: colors.text }]}>Количество</Text>
              <TextInput
                style={[styles.number, styles.field, { color: colors.text }]}
                editable={true}
                keyboardType="decimal-pad"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                autoFocus={isFocused}
                value={goodQty}
              />
            </View>
          </View>
          <ItemSeparator />
        </View>
        {
          // <List.Accordion id={'package'} key={'package'} title={'Упаковка'}>
          //   {listPackageTypes.map((packege) => {
          //     return (
          //       <List.Item
          //         key={packege.id ?? '1'}
          //         title={packege.value ?? ''}
          //         onPress={() =>
          //           actions.setForm({
          //             ...state.forms?.documentLineParams,
          //             packagekey: packege.id,
          //           })
          //         }
          //         right={() => (
          //           <Checkbox color={colors.primary} status={packagekey === packege.id ? 'checked' : 'unchecked'} />
          //         )}
          //         style={styles.item}
          //       />
          //     );
          //   })}
          // </List.Accordion>
        }
        {/*<View style={[styles.fieldContainer, { backgroundColor: colors.card }]}>
          <Text style={styles.inputCaption}>Упаковка:</Text>
          <ReferenceItem
            value={selectedItem(listPackageTypes, packagekey)?.value}
            disabled={false}
            onPress={() =>
              navigation.navigate('SelectItem', {
                formName: 'documentLineParams',
                title: 'Упаковка',
                fieldName: 'packagekey',
                list: listPackageTypes,
                value: [packagekey],
              })
            }
          />
        </View>*/}
        <ItemSeparator />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderLine;
