import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { IReference } from '@lib/types';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';

import { ReturnsStackParamList } from '../../../navigation/Root/types';

import { IGood, IReturnLine } from '../../../store/docs/types';

interface IProps {
  item: IReturnLine;
  onSetLine: (value: IReturnLine) => void;
}

const ReturnLine = ({ item, onSetLine }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { docId } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnLine'>>().params;

  const [goodQty, setGoodQty] = useState<string>(item?.quantity.toString() || '0');
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

  const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteDocumentLine({ docId, lineId: item.id }));
    navigation.goBack();
  }, [dispatch, docId, item.id, navigation]);

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
        <PrimeButton icon="delete" onPress={handleDelete} outlined>
          Удалить позицию
        </PrimeButton>
      </View>
      <ItemSeparator />
    </ScrollView>
  );
};

export default ReturnLine;
