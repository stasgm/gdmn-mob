import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { documentActions, useDispatch } from '@lib/store';

import { IInventoryLine } from '../../../store/types';
import { InventorysStackParamList } from '../../../navigation/Root/types';

interface IProps {
  item: IInventoryLine;
  onSetLine: (value: IInventoryLine) => void;
}

export const InventoryLine = ({ item, onSetLine }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  console.log('InventoryLine', item);
  const { docId, mode } = useRoute<RouteProp<InventorysStackParamList, 'InventoryLine'>>().params;

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString());

  const currRef = useRef<TextInput>(null);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), 500);
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

  const handleDelete = useCallback(() => {
    !!mode &&
      Alert.alert('Предупреждение', 'Вы действительно хотите удалить позицию?', [
        {
          text: 'Удалить',
          onPress: () => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: item.id }));
            navigation.goBack();
          },
        },
        { text: 'Отмена' },
      ]);
  }, [dispatch, docId, item.id, mode, navigation]);

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  const price = item?.price || 0;
  //console.log('Item', item);
  return (
    <>
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
              <Text style={[styles.number, styles.field]}>{price.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество</Text>
              <TextInput
                style={[styles.number, styles.field]}
                editable={true}
                keyboardType="numeric"
                onChangeText={handelQuantityChange}
                returnKeyType="done"
                ref={currRef}
                value={goodQty}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {mode ? (
        <PrimeButton icon="delete" onPress={handleDelete} outlined disabled={!mode}>
          Удалить позицию
        </PrimeButton>
      ) : null}
    </>
  );
};

/* const localStyles = StyleSheet.create({
  text: {
    padding: 10,
  },
}); */
