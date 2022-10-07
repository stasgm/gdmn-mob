import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, Modal } from 'react-native';

import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { globalStyles as styles, SaveButton } from '@lib/mobile-ui';

import { IconButton, Title } from 'react-native-paper';

import { ScreenState } from '@lib/types';

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

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  const [line, setLine] = useState<IOrderLine>(item);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      if (!line.package && packages.length > 0) {
        Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
        setScreenState('idle');
        return;
      }

      if (line.quantity) {
        dispatch(
          mode === 0
            ? documentActions.addDocumentLine({ docId, line })
            : documentActions.updateDocumentLine({ docId, line }),
        );
        onDismiss();
      } else {
        Alert.alert('Внимание!', 'В позиции не указан вес товара. Все равно продолжить сохранение?', [
          {
            text: 'Да',
            onPress: () => {
              dispatch(
                mode === 0
                  ? documentActions.addDocumentLine({ docId, line })
                  : documentActions.updateDocumentLine({ docId, line }),
              );
              onDismiss();
              setScreenState('idle');
            },
          },
          { text: 'Отмена', onPress: () => setScreenState('idle') },
        ]);
      }
    }
  }, [dispatch, docId, line, mode, onDismiss, packages.length, screenState]);

  return (
    <Modal animationType="none" visible={true}>
      <View style={styles.container}>
        <View style={localStyles.navigation}>
          <IconButton icon="chevron-left" onPress={onDismiss} size={30} />
          <Title>Позиция заявки</Title>
          <View style={localStyles.btnOk}>
            <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />
          </View>
        </View>
        <OrderLine item={line} packages={packages} onSetLine={setLine} />
      </View>
    </Modal>
  );
};

export default OrderLineEdit;

const localStyles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
  },
  btnOk: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
