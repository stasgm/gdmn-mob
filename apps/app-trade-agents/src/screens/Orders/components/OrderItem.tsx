import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles as styles } from '@lib/mobile-ui';
import { documentActions, refSelectors, useDispatch } from '@lib/store';

import { Menu } from 'react-native-paper';

import { IGood, IOrderLine } from '../../../store/types';
import { OrdersStackParamList } from '../../../navigation/Root/types';

interface IProps {
  docId: string;
  item: IOrderLine;
  readonly?: boolean;
}

const OrderItem = ({ docId, item, readonly = false }: IProps) => {
  const dispatch = useDispatch();

  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();

  const [visible, setVisible] = useState(false);
  console.log('vi', visible);
  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('OrderLine', { mode: 1, docId, item });
      }}
      onLongPress={() => setVisible(true)}
      // onLongPress={() => {
      // !readonly && navigation.navigate('OrderLine', { mode: 1, docId, item });
      // }}
    >
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <View style={[styles.item]}>
            <View style={[styles.icon]}>
              <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.good.name}</Text>
              <View style={[styles.directionRow]}>
                <Text style={textStyle}>
                  {/* {item.quantity} {(good?.scale || 1) === 1 ? '' : 'уп. x ' + (good?.scale || 1).toString()} x{' '} */}
                  {item.quantity} {(good?.scale || 1) === 1 ? '' : 'уп. x ' + (good?.scale || 1).toString()}
                  {'кг  x  '}
                  {(good?.priceFsn || 0).toString()} р.
                </Text>
                {/* <Text style={textStyle}>
              {Math.floor(item.quantity * (good?.invWeight ?? 1) * (good?.scale ?? 1) * 1000) / 1000} кг
            </Text> */}
              </View>
              {item.packagekey ? <Text style={textStyle}>Упаковка: {item.packagekey?.name}</Text> : null}
            </View>
          </View>
        }
      >
        <Menu.Item
          onPress={() => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: item.id }));
          }}
          title="Удалить позицию"
        />
      </Menu>
      {/* {visible && ( */}

      {/*    <View style={localStyles.contactType}> */}
      {/* <Menu
          title="123"
          options={[{ id: '1', value: 'Удаліть позіцію' }]}
          onChange={() => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: item.id }));
          }}
          onDismiss={() => setVisible(false)}
          visible={true}
        /> */}
      {/* </View> */}
      {/* )} */}
    </TouchableOpacity>
  );
};

export default OrderItem;

export const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
    paddingLeft: 5,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
  contactType: {
    marginTop: -1,
    marginBottom: -4,
  },
});
