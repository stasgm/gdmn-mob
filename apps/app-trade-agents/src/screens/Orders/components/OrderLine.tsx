import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { AppInputScreen, ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused } from '@react-navigation/native';

import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';

import { IGood, IOrderLine } from '../../../store/docs/types';

interface IProps {
  item: IOrderLine;
  onSetLine: (value: IOrderLine) => void;
}

const OrderLine = ({ item, onSetLine }: IProps) => {
  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString() || '1');
  const isFocused = useIsFocused();

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
    <AppInputScreen>
      <ScrollView>
        <View style={[styles.content]}>
          <View style={[styles.item]}>
            <View style={styles.details}>
              <Text style={styles.name}>Наименование</Text>
              <Text style={[styles.number, styles.field]}>{item ? item.good.name || 'товар не найден' : ''}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Цена</Text>
              <Text style={[styles.number, styles.field]}>{priceFSN.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество</Text>
              <TextInput
                style={[styles.number, styles.field]}
                editable={true}
                keyboardType="decimal-pad"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                autoFocus={isFocused}
                value={goodQty}
              />
            </View>
          </View>
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
    </AppInputScreen>
  );
};

export default OrderLine;
