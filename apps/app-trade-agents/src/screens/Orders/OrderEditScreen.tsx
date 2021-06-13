import { v4 as uuid } from 'uuid';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, TouchableOpacity, View, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { docSelectors, documentActions, useDispatch as useDocDispatch } from '@lib/store';
import { BackButton, AppInputScreen, Input, ScreenTitle, SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { INamedEntity, IDocument, IEntity, IUserDocument, StatusType } from '@lib/types';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';
import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';
import { orderType } from '../../store/docs/mock';
import { IFormParam } from '../../store/app/types';

interface IOrderFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
}

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === id);

  const [statusId, setStatusId] = useState('DRAFT');

  const formParams = useSelector((state) => state.app.formParams);

  const {
    contact: docContact,
    outlet: docOutlet,
    number: docNumber,
    documentDate: docDocumentDate,
    onDate: docOnDate,
    status: docStatus,
  } = useMemo(() => {
    return formParams as IOrderFormParam;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStatusId(order?.status || 'DRAFT');

    // Инициализируем параметры
    if (order) {
      dispatch(
        appActions.setFormParams({
          number: order.number,
          contact: order.head.contact,
          outlet: order.head.outlet,
          onDate: order.head.onDate,
          documentDate: order.documentDate,
          status: order.status,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, order]);

  const handleSave = useCallback(() => {
    if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
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

      docDispatch(documentActions.addDocument(newOrder as unknown as IUserDocument<IDocument, IEntity[]>));
    } else {
      if (!order) {
        return;
      }

      const updatedHead: IOrderDocument = {
        id,
        documentType: orderType,
        number: docNumber,
        documentDate: docDocumentDate,
        status: docStatus || 'DRAFT',
        head: {
          contact: docContact,
          onDate: docOnDate,
          outlet: docOutlet,
        },
        lines: { ...order.lines },
        creationDate: order.creationDate || new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      docDispatch(documentActions.updateDocument({ docId: id, head: updatedHead as unknown as IUserDocument }));
    }
    navigation.goBack();
  }, [docNumber, docContact, docOutlet, docOnDate, docDocumentDate, id, navigation, docDispatch, order, docStatus]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const isBlocked = statusId !== 'DRAFT';

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
      value: docContact,
    });
  };

  const handlePresentOutlet = () => {
    //TODO: если изменился контакт, то и магазин должен обнулиться
    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      clause: params,
      value: docOutlet,
    });
  };

  return (
    <AppInputScreen>
      <ScreenTitle>{statusName}</ScreenTitle>
      {(statusId === 'DRAFT' || statusId === 'READY') && (
        <>
          <View style={[styles.directionRow, { margin: 10 }]}>
            <Text>Черновик:</Text>
            <Switch
              value={docStatus === 'DRAFT' || !docStatus}
              // disabled={id === undefined}
              onValueChange={() => {
                dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
              }}
            />
          </View>
        </>
      )}
      <Input
        label="Номер документа"
        value={docNumber as string}
        onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
        editable={!isBlocked}
      />
      <TouchableOpacity onPress={handlePresentOnDate} disabled={isBlocked}>
        <Input label="Дата отгрузки" value={getDateString(docOnDate || '')} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentContact} disabled={isBlocked}>
        <Input label="Организация" value={docContact?.name} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentOutlet} disabled={isBlocked}>
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
