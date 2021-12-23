import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator } from '@lib/mobile-ui';
import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { INamedEntity } from '@lib/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { IOrderLine, IPackageGood } from '../../../store/types';

import { OrdersStackParamList } from '../../../navigation/Root/types';

import Checkbox from './Checkbox';

interface IProps {
  item: IOrderLine;
  onSetLine: (value: IOrderLine) => void;
}

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const OrderLine = ({ item, onSetLine }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { docId, mode } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString());
  // const isFocused = useIsFocused();
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

  useEffect(() => {
    onSetLine({ ...item, packagekey: pack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  // const priceFSN =
  //   (refSelectors.selectByName('good') as IReference<IGood>)?.data?.find((e) => e.id === item?.good.id)?.priceFsn || 0;

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
              <Text style={[styles.number, styles.field]}>{item.good.priceFsn.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.item}>
            <View style={styles.details}>
              <Text style={styles.name}>Количество мест</Text>
              <TextInput
                style={[styles.number, styles.field]}
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
          <TouchableOpacity style={styles.item} onPress={() => setIsVisiblePackages(!isVisiblePackages)}>
            <View style={styles.details}>
              <Text style={styles.name}>Упаковка</Text>
              <Text style={[styles.number, styles.field]}>{pack ? pack.name || 'упаковка не найдена' : ''}</Text>
            </View>
            <MaterialCommunityIcons
              name={(isVisiblePackages ? 'chevron-up' : 'chevron-down') as Icon}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {isVisiblePackages && (
            <View>
              {packages.length > 0 ? (
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
              ) : (
                <Text style={localStyles.text}>Для данного товара нет</Text>
              )}
            </View>
          )}
          <ItemSeparator />
        </View>
      </ScrollView>
      {/* {mode ? (
        <PrimeButton icon="delete" onPress={handleDelete} outlined disabled={!mode}>
          Удалить позицию
        </PrimeButton>
      ) : null} */}
    </>
  );
};

const localStyles = StyleSheet.create({
  packages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    padding: 10,
  },
});

export default OrderLine;
