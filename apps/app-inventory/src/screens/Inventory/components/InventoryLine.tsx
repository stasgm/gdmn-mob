import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View, Text, Alert, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { documentActions, useDispatch } from '@lib/store';

import { IInventoryLine } from '../../../store/types';
import { InventorysStackParamList } from '../../../navigation/Root/types';
import { ScanDataMatrix } from './Scanners/ScanDataMatrix';
import { IconButton } from 'react-native-paper';

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
  const [goodEID, setGoodEID] = useState<string | undefined>(item?.EID?.toString());
  const [doScanned, setDoScanned] = useState(false);

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
            dispatch(documentActions.deleteDocumentLine({ docId, lineId: item.id }));
            navigation.goBack();
          },
        },
        { text: 'Отмена' },
      ]);
  }, [dispatch, docId, item.id, mode, navigation]);

  const handleScanner = useCallback(() => {
    navigation.navigate('ScanDataMatrix', { docId: docId });
  }, [docId, navigation]);

  const handleEIDScanned = (data: string) => {
    setDoScanned(false);
    setGoodEID(data);
  };

  const handelEIDChange = useCallback((value: string) => {
    setGoodEID(value);
  }, []);

  useEffect(() => {
    onSetLine({ ...item, quantity: parseFloat(goodQty), EID: goodEID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty, goodEID]);

  const price = item?.price || 0;
  return (
    <>
      <Modal animationType="slide" visible={doScanned}>
        <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
      </Modal>
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
              <Text style={styles.name}>Остаток</Text>
              <Text style={[styles.number, styles.field]}>{remains.toString()}</Text>
            </View>
          </View>
          <ItemSeparator />

          <View style={styles.item}>
            <View style={localStyles.details}>
              <View style={localStyles.new}>
                <Text style={styles.name}>EID</Text>
                <Text style={[styles.number, styles.field]}>{item?.EID || 'Не указан'}</Text>
              </View>
              <View style={localStyles.button}>
                {item?.EID && (
                  <TouchableOpacity>
                    <IconButton icon="close" size={20} onPress={() => setGoodEID(undefined)} />
                  </TouchableOpacity>
                )}
              </View>
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
          <View>
            <PrimeButton icon="barcode-scan" onPress={() => setDoScanned(true)}>
              Сканировать EID
            </PrimeButton>
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

const localStyles = StyleSheet.create({
  button: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    // top: 5,
    right: -10,
    zIndex: 5,
    // width: '100%',
  },
  new: {
    width: '90%',
  },
  details: {
    flex: 1,
    margin: 5,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
