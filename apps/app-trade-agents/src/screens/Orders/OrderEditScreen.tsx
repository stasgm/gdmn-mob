import { v4 as uuid } from 'uuid';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { docSelectors, documentActions, useDispatch as useDocDispatch } from '@lib/store';
import { BackButton, AppInputScreen, Input, ScreenTitle, SaveButton } from '@lib/mobile-ui';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderHead } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';
import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';
import { orderType } from '../../store/docs/mock';
import { IDocument, IEntity, IUserDocument } from '../../../../../packages/types';

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === id);

  const [status, setStatus] = useState(order?.status || 0);
  const [docNumber, setDocNumber] = useState(order?.number);
  const [docOnDate, setDocOnDate] = useState(order?.head.ondate || new Date().toISOString().slice(0, 10));
  const [docContact, setDocContact] = useState(order?.head.contact);
  const [docOutlet, setDocOutlet] = useState(order?.head.outlet);

  const formParams = useSelector((state) => state.app.formParams);

  const { contact, outlet } = useMemo(() => {
    return (formParams || {}) as Partial<IOrderHead>;
  }, [formParams]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const cleanFormParams = () => dispatch(appActions.cleanFormParams());

  //     return () => cleanFormParams();
  //   }, [dispatch]),
  // );

  useEffect(() => {
    setDocContact(contact);
  }, [contact]);

  useEffect(() => {
    setDocOutlet(outlet);
  }, [outlet]);

  const checkDocument = useCallback(() => {
    const res = docNumber && docContact && docOutlet;
    console.log(docNumber, docContact, docOutlet);

    if (!res) {
      Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    return res;
  }, [docContact, docNumber, docOutlet]);

  const handleSave = useCallback(() => {
    console.log('id', id);
    if (!checkDocument()) {
      return;
    }
    if (!id) {
      if (docNumber && docContact && docOutlet) {
        const newOrder: IOrderDocument = {
          id: uuid(),
          documentType: orderType,
          number: docNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: docContact,
            ondate: docOnDate,
            outlet: docOutlet,
          },
          lines: [],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        };
        console.log('newOrder', newOrder);
        docDispatch(documentActions.addDocument(newOrder as unknown as IUserDocument<IDocument, IEntity[]>));
      }
    } else {
      if (order && docNumber && docContact && docOnDate && docOutlet) {
        const updatedHead: IOrderDocument = {
          id: order.id,
          documentType: order.documentType,
          number: docNumber,
          documentDate: order.documentDate,
          status: 'DRAFT',
          head: {
            contact: docContact,
            ondate: docOnDate,
            outlet: docOutlet,
          },
          lines: { ...order.lines },
          creationDate: order.creationDate,
          editionDate: new Date().toISOString(),
        };
        console.log('updatedHead', updatedHead);
        docDispatch(documentActions.updateDocument({ docId: id, head: updatedHead as unknown as IUserDocument }));
      }
    }

    navigation.goBack();
    // navigation.navigate('OrderList');
  }, [id, checkDocument, navigation, docNumber, docContact, docOutlet, docOnDate, docDispatch, order]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [handleSave, navigation]);

  const isBlocked = status !== 0;

  const statusName =
    id !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа';

  //---Окно календаря для выбора даты---
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowOnDate(false);
    if (selectedOnDate) {
      setDocOnDate(selectedOnDate.toISOString().slice(0, 10));
    }
  };

  const handlePresentOnDate = () => {
    setShowOnDate(true);
  };

  const handlePresentContact = () => {
    navigation.navigate('SelectItem', {
      refName: 'contact',
      fieldName: 'contact',
      title: 'Организация',
      value: order?.head.contact || docContact,
    });
  };

  const handlePresentOutlet = () => {
    navigation.navigate('SelectItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      title: 'Магазин',
      value: order?.head.outlet || docOutlet,
    });
  };

  return (
    <AppInputScreen>
      <ScreenTitle>{statusName}</ScreenTitle>
      <Input label="Номер документа" value={docNumber} onChangeText={setDocNumber} />
      {/* <Input label="Дата документа" value={getDateString(docDate)} editable={false} /> */}
      <TouchableOpacity onPress={handlePresentOnDate}>
        <Input label="Дата отгрузки" value={getDateString(docOnDate)} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentContact}>
        <Input label="Организация" value={docContact?.name} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentOutlet}>
        <Input label="Магазин" value={docOutlet?.name} editable={false} />
      </TouchableOpacity>
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docOnDate)}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={handleApplyOnDate}
        />
      )}
    </AppInputScreen>
  );
};

export default OrderEditScreen;
