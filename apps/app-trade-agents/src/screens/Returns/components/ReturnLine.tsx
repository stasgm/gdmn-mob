import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Alert } from 'react-native';

import { ReturnsStackParamList } from '../../../navigation/Root/types';

import { IGood, IReturnLine } from '../../../store/types';

interface IProps {
  item: IReturnLine;
  onSetLine: (value: IReturnLine) => void;
}

const ReturnLine = ({ item, onSetLine }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { docId, mode } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnLine'>>().params;

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
    qtyRef?.current && setTimeout(() => qtyRef.current?.focus(), 500);
  }, []);

  const handleDelete = useCallback(() => {
    !!mode &&
      Alert.alert('Предупреждение', 'Вы действительно хотите удалить позицию?', [
        {
          text: 'Удалить',
          onPress: () => {
            dispatch(documentActions.deleteDocumentLine({ docId, lineId: item.id }));
            navigation.goBack();
          },
        },
        { text: 'Отмена' },
      ]);
  }, [dispatch, docId, item.id, mode, navigation]);

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty) });
    //TODO Исправить
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  const priceFSN = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id)?.priceFsn || 0;

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
              <Text style={[styles.number, styles.field, { color: colors.text }]}>{priceFSN.toString()}</Text>
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
                // autoFocus={isFocused}
                value={goodQty}
              />
            </View>
          </View>
        </View>
        <ItemSeparator />
      </ScrollView>
      {/* {mode ? (
        <PrimeButton icon="delete" onPress={handleDelete} outlined>
          Удалить позицию
        </PrimeButton>
      ) : null} */}
    </>
  );
};

export default ReturnLine;
