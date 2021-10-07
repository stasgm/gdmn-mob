import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, Platform } from 'react-native';
import { StackActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import {
  docSelectors,
  documentActions,
  refSelectors,
  useDispatch as useDocDispatch,
  useSelector,
  appActions,
  useDispatch,
} from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  Input,
  SelectableInput,
  SaveButton,
 // globalStyles as styles,
  SubTitle,
  PrimeButton,
} from '@lib/mobile-ui';

import { IDocumentType, IReference } from '@lib/types';

import { ISellBill, IOutlet } from '../../store/types';

import { getDateString } from '../../utils/helpers';
import { ISellFormParam } from '../../store/app/types';

const ReturnSellBillScreen = () => {
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const bill = docSelectors.selectByDocType<ISellBill>('order')?.find((e) => e.id === id);

  const billType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'sellBill');

  const formParams = useSelector((state) => state.app.formParams as ISellFormParam);

  const {
    contact: docContact,
    outlet: docOutlet,
    depart: docDepart,
    number: docNumber,
    documentDate: docDocumentDate,
    onDate: docOnDate,
    route: docRoute,
  } = useMemo(() => {
    return formParams;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === docOutlet?.id);

  useEffect(() => {
    // Инициализируем параметры
    if (bill) {
      dispatch(
        appActions.setFormParams({
          number: bill.number,
          //contact: order.head.contact,
          outlet: bill.head.outlet,
          onDate: bill.head.onDate,
          documentDate: bill.documentDate,
          route: bill.head.route,
          depart: bill.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
        }),
      );
    }
  }, [dispatch, bill]);

  const handleSave = useCallback(() => {
    if (!billType) {
      return Alert.alert('Ошибка!', 'Тип документа для отправления базовой какладной не найден', [{ text: 'OK' }]);
    }

    if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    const newOrderDate = new Date().toISOString();

    if (!id) {
      const newBill: ISellBill = {
        id: docId,
        documentType: billType,
        number: docNumber,
        documentDate: newOrderDate,
        head: {
          contact: docContact,
          onDate: docOnDate,
          outlet: docOutlet,
          depart: docDepart,
        },
        lines: [],
        creationDate: newOrderDate,
        editionDate: newOrderDate,
      };

      docDispatch(documentActions.addDocument(newBill));

    } else {
      if (!bill) {
        return;
      }
    }
  }, [
    billType,
    docNumber,
    docContact,
    docOutlet,
    docOnDate,
    docDocumentDate,
    id,
    docDispatch,
    docDepart,
  ]);

  const statusName = 'Базовая накладная';

  // Окно календаря для выбора даты
  const [showOnDate, setShowOnDate] = useState(false);

    setShowOnDate(true);
  };
};

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <Input
        label="Номер документа"
        value={docNumber}
        onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
        disabled={isBlocked}
      />
      <SelectableInput
        label="Начальная дата"
        value={getDateString(docOnDate || '')}
        onPress={handlePresentOnDate}
      />
      <SelectableInput
        label="Конечная дата"
        value={getDateString(docOnDate || '')}
        onPress={handlePresentOnDate}
      />
      <SelectableInput
        label="Организация"
        placeholder="Выберите организацию..."
        value={docContact?.name}
        onPress={handlePresentContact}
        disabled={isBlocked}
      />
      <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} disabled={isBlocked} />
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docOnDate || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDate}
        />
      )}
      <View>
              <PrimeButton outlined /*onPress={handle}*/ >
          Отправить
        </PrimeButton>
        {/*         <PrimeButton outlined onPress={handleChangeCompany}>
          Сменить организацию
        </PrimeButton> */}
      </View>
    </AppInputScreen>
  );
};

export default ReturnSellBillScreen;

// const localStyles = StyleSheet.create({
//   switchContainer: {
//     margin: 10,
//   },
// });
