import { v4 as uuid } from 'uuid';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { docSelectors, documentActions, useDispatch as useDocDispatch } from '@lib/store';
import { BackButton, AppInputScreen, Input, ScreenTitle, SaveButton } from '@lib/mobile-ui';

import { INamedEntity } from '@lib/types';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';
import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';
import { orderType } from '../../store/docs/mock';
import { IDocument, IEntity, IUserDocument } from '../../../../../packages/types';
import { IFormParam } from '../../store/app/types';

interface IOrderFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  number?: string;
  documentDate?: string;
  onDate?: string;
}

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === id);

  const [status, setStatus] = useState(order?.status || 0);

  const formParams = useSelector((state) => state.app.formParams);

  console.log('formParams', formParams);

  const {
    contact: docContact,
    outlet: docOutlet,
    number: docNumber,
    documentDate: docDocumentDate,
    onDate: docOnDate,
  } = useMemo(() => {
    return formParams as IOrderFormParam;
  }, [formParams]);

  useEffect(() => {
    setStatus(order?.status || 'DRAFT');

    // Инициализируем параметры
    if (order) {
      dispatch(
        appActions.setFormParams({
          number: order.number,
          contact: order.head.contact,
          outlet: order.head.outlet,
          onDate: order.head.onDate,
          documentDate: order.documentDate,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
        }),
      );
    }
  }, [dispatch, order]);

  const handleSave = useCallback(() => {
    if (!docNumber || !docContact || !docOutlet || !docOnDate || !docDocumentDate) {
      Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      return;
    }

    if (!id) {
      const newOrder: IOrderDocument = {
        id: uuid(),
        documentType: orderType,
        number: docNumber,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          contact: docContact,
          onDate: docOnDate,
          outlet: docOutlet,
        },
        lines: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };
      console.log('newOrder', newOrder);
      docDispatch(documentActions.addDocument(newOrder as unknown as IUserDocument<IDocument, IEntity[]>));
    } else {
      if (!order) {
        return;
      }
      console.log(docOutlet);
      const updatedHead: IOrderDocument = {
        id,
        documentType: orderType,
        number: docNumber,
        documentDate: docDocumentDate,
        status: 'DRAFT',
        head: {
          contact: docContact,
          onDate: docOnDate,
          outlet: docOutlet,
        },
        lines: { ...order.lines },
        creationDate: order.creationDate || new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };
      console.log('updatedHead', updatedHead);
      docDispatch(documentActions.updateDocument({ docId: id, head: updatedHead as unknown as IUserDocument }));
    }
    dispatch(appActions.clearFormParams());
    navigation.goBack();
    // navigation.navigate('OrderList');
  }, [docNumber, docContact, docOutlet, docOnDate, docDocumentDate, id, dispatch, navigation, docDispatch, order]);

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
      dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString().slice(0, 10) }));
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
      <Input
        label="Номер документа"
        value={docNumber as string}
        onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
      />
      {/* <Input label="Дата документа" value={getDateString(docDate)} editable={false} /> */}
      <TouchableOpacity onPress={handlePresentOnDate}>
        <Input label="Дата отгрузки" value={getDateString(docOnDate || '')} editable={false} />
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
          value={new Date(docOnDate || '')}
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
