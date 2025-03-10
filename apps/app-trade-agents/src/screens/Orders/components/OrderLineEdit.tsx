import React, { useCallback, useState } from 'react';
import { View, Alert, StyleSheet, Modal, SafeAreaView } from 'react-native';

import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { SaveButton } from '@lib/mobile-ui';

import { IconButton, Title } from 'react-native-paper';

import { ScreenState } from '@lib/types';

import { useTheme } from '@react-navigation/native';

import { IOrderLine, IPackageGood } from '../../../store/types';

import OrderLine from './OrderLine';

export interface IOrderItemLine {
  mode: number;
  docId: string;
  item: IOrderLine;
}

interface IProps {
  orderLine: IOrderItemLine;
  onDismiss: () => void;
}

const OrderLineEdit = ({ orderLine, onDismiss }: IProps) => {
  const dispatch = useDispatch();
  const { mode, item, docId } = orderLine;

  const [line, setLine] = useState<IOrderLine>(item);
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const { colors } = useTheme();

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  const handleSaveLine = useCallback(() => {
    setScreenState('saving');
    if (!line.package && packages?.length > 0) {
      Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
      setScreenState('idle');
      return;
    }
    if (line.quantity < 0) {
      Alert.alert('Ошибка!', 'Вес товара не может быть меньше нуля!', [{ text: 'Ок' }]);
      setScreenState('idle');
      return;
    }
    if (line.quantity) {
      dispatch(
        mode === 0
          ? documentActions.addDocumentLine({ docId, line })
          : documentActions.updateDocumentLine({ docId, line }),
      );
      setScreenState('idle');
      onDismiss();
    } else {
      Alert.alert('Внимание!', 'В позиции не указан вес товара.\nВсе равно продолжить сохранение?', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(
              mode === 0
                ? documentActions.addDocumentLine({ docId, line })
                : documentActions.updateDocumentLine({ docId, line }),
            );
            setScreenState('idle');
            onDismiss();
          },
        },
        { text: 'Отмена', onPress: () => setScreenState('idle') },
      ]);
    }
  }, [dispatch, docId, line, mode, onDismiss, packages?.length]);

  return (
    <Modal animationType="fade" visible={true}>
      <SafeAreaView style={localStyles.container}>
        <View style={localStyles.container1}>
          <View style={localStyles.navigation}>
            <IconButton icon="chevron-left" onPress={onDismiss} size={30} />
            <Title>Позиция заявки</Title>
            <View style={localStyles.btnOk}>
              <SaveButton onPress={handleSaveLine} disabled={screenState === 'saving'} />
            </View>
          </View>
          <View style={[{ backgroundColor: colors.background }, localStyles.orderLineItem]}>
            <OrderLine item={line} packages={packages} onSetLine={setLine} onSave={handleSaveLine} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OrderLineEdit;

const localStyles = StyleSheet.create({
  container1: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'transparent',
  },
  btnOk: {
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  orderLineItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});
