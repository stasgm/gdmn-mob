import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';

import { IGood, IReturnLine } from '../../../store/docs/types';

interface IProps {
  item: IReturnLine;
  onSetLine: (value: IReturnLine) => void;
}

const ReturnLine = ({ item, onSetLine }: IProps) => {
  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString() || '1');
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

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  /*   const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      if (isFocused) {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
      }

      return;
    }, [isFocused]); */

  const priceFSN =
    (refSelectors.selectByName('good') as IReference<IGood>)?.data?.find((e) => e.id === item?.good.id)?.priceFsn || 0;

  return (
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
        {/* <ItemSeparator /> */}
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
  );
};

export default ReturnLine;
