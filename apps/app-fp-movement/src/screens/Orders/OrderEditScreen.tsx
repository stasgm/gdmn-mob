import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
import { AppInputScreen, Input, SelectableInput, SaveButton, SubTitle, RadioGroup } from '@lib/mobile-ui';
import { IDocumentType, IReference } from '@lib/types';

import { generateId, getDateString } from '@lib/mobile-app';

import { OrderStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOutlet, IOrderFormParam, ITempDocument } from '../../store/types';
import { getNextDocNumber } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';
import { STATUS_LIST } from '../../utils/constants';

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrderStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OrderEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const temps = docSelectors.selectByDocType<ITempDocument>('temp');
  const order = temps?.find((e) => e.id === id);

  const number1 = order?.number;
  const contact1 = order?.head.contact;
  const outlet1 = order?.head.outlet;
  const onDate1 = order?.head.onDate;

  console.log('order', order?.head.barcode);
  const orderType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'order');

  const formParams = useSelector((state) => state.app.formParams as IOrderFormParam);

  // Подразделение по умолчанию
  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const {
    depart: docDepart,
    documentDate: docDocumentDate,
    status: docStatus,
  } = useMemo(() => {
    return formParams;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Инициализируем параметры
    if (order) {
      dispatch(
        appActions.setFormParams({
          documentDate: order.documentDate,
          status: order.status,
          depart: order.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          depart: defaultDepart,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, order, defaultDepart]);

  const handleSave = useCallback(() => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    if (!(/*docNumber  && docContact && docOutlet && docOnDate &&*/ docDocumentDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? generateId() : id;

    const newOrderDate = new Date().toISOString();

    if (!id) {
      const newOrder: IOrderDocument = {
        id: docId,
        documentType: orderType,
        documentDate: newOrderDate,
        status: 'DRAFT',
        head: {
          depart: docDepart,
        },
        lines: [],
        creationDate: newOrderDate,
        editionDate: newOrderDate,
      };

      dispatch(documentActions.addDocument(newOrder));

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
        status: docStatus || 'DRAFT',
        documentDate: docDocumentDate,
        documentType: orderType,
        errorMessage: undefined,
        head: {
          ...order.head,
          depart: docDepart,
        },
        lines: order.lines,
        creationDate: order.creationDate || updatedOrderDate,
        editionDate: updatedOrderDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedOrder }));
      navigation.navigate('OrderView', { id });
    }
  }, [orderType, docDocumentDate, id, docDepart, dispatch, navigation, order, docStatus]);

  const renderRight = useCallback(() => <SaveButton onPress={handleSave} />, [handleSave]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const isBlocked = useMemo(() => docStatus !== 'DRAFT', [docStatus]);

  const statusName = useMemo(
    () => (id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ'),
    [id, isBlocked],
  );

  const handlePresentDepart = useCallback(() => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'depart',
      value: docDepart && [docDepart],
    });
  }, [docDepart, isBlocked, navigation]);

  const handleChangeStatus = useCallback(() => {
    dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
  }, [dispatch, docStatus]);

  const viewStyle = useMemo(
    () => [
      localStyles.switchContainer,
      localStyles.border,
      { borderColor: colors.primary, backgroundColor: colors.card },
    ],
    [colors.card, colors.primary],
  );

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView>
        <View style={viewStyle}>
          <RadioGroup
            options={STATUS_LIST}
            onChange={handleChangeStatus}
            activeButtonId={STATUS_LIST.find((i) => i.id === docStatus)?.id}
            directionRow={true}
          />
        </View>
        <Input label="Номер" value={number1} disabled={true} />
        <Input label="Дата отгрузки" value={getDateString(onDate1 || '')} disabled={true} />
        <Input label="Организация" value={contact1?.name} disabled={true} />
        <Input label="Магазин" value={outlet1?.name} disabled={true} />
        <SelectableInput
          label="Склад-магазин"
          value={docDepart?.name}
          onPress={handlePresentDepart}
          disabled={isBlocked}
        />
      </ScrollView>
    </AppInputScreen>
  );
};

export default OrderEditScreen;

const localStyles = StyleSheet.create({
  switchContainer: {
    marginVertical: 10,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
});
