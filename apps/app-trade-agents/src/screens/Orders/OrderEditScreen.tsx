import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
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
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';
import { IDocumentType, IReference } from '@lib/types';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOutlet, IOrderFormParam } from '../../store/types';
import { getDateString } from '../../utils/helpers';

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const order = docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === id);

  const orderType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'order');

  const formParams = useSelector((state) => state.app.formParams as IOrderFormParam);

  // Подразделение по умолчанию
  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const {
    contact: docContact,
    outlet: docOutlet,
    depart: docDepart,
    number: docNumber,
    documentDate: docDocumentDate,
    onDate: docOnDate,
    status: docStatus,
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
    if (!docContact && !!docOutlet) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['contact']: outlet?.company,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docOutlet, outlet?.company]);

  useEffect(() => {
    if (!!docContact && !!docOutlet && docContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['outlet']: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docContact?.id, outlet?.company.id]);

  useEffect(() => {
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
          route: order.head.route,
          depart: order.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          depart: defaultDepart,
        }),
      );
    }
  }, [dispatch, order, defaultDepart]);

  const handleSave = useCallback(() => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    const newOrderDate = new Date().toISOString();

    if (!id) {
      const newOrder: IOrderDocument = {
        id: docId,
        documentType: orderType,
        number: docNumber,
        documentDate: newOrderDate,
        status: 'DRAFT',
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

      docDispatch(documentActions.addDocument(newOrder));

      navigation.dispatch(StackActions.replace('OrderView', { id: newOrder.id }));
      // navigation.navigate('OrderView', { id: newOrder.id });
    } else {
      if (!order) {
        return;
      }

      const updatedOrderDate = new Date().toISOString();

      const updatedOrder: IOrderDocument = {
        ...order,
        id,
        number: docNumber,
        status: docStatus || 'DRAFT',
        documentDate: docDocumentDate,
        documentType: orderType,
        errorMessage: undefined,
        head: {
          ...order.head,
          contact: docContact,
          outlet: docOutlet,
          onDate: docOnDate,
          depart: docDepart,
        },
        lines: order.lines,
        creationDate: order.creationDate || updatedOrderDate,
        editionDate: updatedOrderDate,
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedOrder }));
      navigation.navigate('OrderView', { id });
    }
  }, [
    orderType,
    docNumber,
    docContact,
    docOutlet,
    docOnDate,
    docDocumentDate,
    id,
    docDispatch,
    navigation,
    order,
    docStatus,
    docDepart,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const isBlocked = docStatus !== 'DRAFT' || !!docRoute;

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowOnDate(false);

    if (selectedOnDate) {
      dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentOnDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowOnDate(true);
  };

  const handlePresentContact = () => {
    if (isBlocked) {
      return;
    }

    if (docRoute) {
      return Alert.alert('Внимание!', 'Нельзя менять организацию! Документ возврата привязан к маршруту.', [
        { text: 'OK' },
      ]);
    }

    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact && [docContact],
    });
  };

  const handlePresentOutlet = () => {
    if (isBlocked) {
      return;
    }

    if (docRoute) {
      return Alert.alert('Внимание!', 'Нельзя менять магазин! Документ возврата привязан к маршруту.', [
        { text: 'OK' },
      ]);
    }

    //TODO: если изменился контакт, то и магазин должен обнулиться
    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      clause: params,
      value: docOutlet && [docOutlet],
    });
  };

  const handlePresentDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'depart',
      value: docDepart && [docDepart],
    });
  };

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView>
        {['DRAFT', 'READY'].includes(docStatus || 'DRAFT') && (
          <>
            <View style={[styles.directionRow, localStyles.switchContainer]}>
              <Text>Черновик:</Text>
              <Switch
                value={docStatus === 'DRAFT' || !docStatus}
                // disabled={isBlocked}
                onValueChange={() => {
                  dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
                }}
              />
            </View>
          </>
        )}
        <Input
          label="Номер документа"
          value={docNumber}
          onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Дата отгрузки"
          value={getDateString(docOnDate || '')}
          onPress={handlePresentOnDate}
          disabled={docStatus !== 'DRAFT'}
        />
        <SelectableInput
          label="Организация"
          placeholder="Выберите покупателя..."
          value={docContact?.name}
          onPress={handlePresentContact}
          disabled={isBlocked}
        />
        <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} disabled={isBlocked} />
        <SelectableInput
          label="Склад-магазин"
          value={docDepart?.name}
          onPress={handlePresentDepart}
          disabled={isBlocked}
        />
      </ScrollView>
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docOnDate || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDate}
        />
      )}
    </AppInputScreen>
  );
};

export default OrderEditScreen;

const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
  },
});
