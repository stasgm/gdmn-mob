import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform, Keyboard } from 'react-native';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
import {
  AppInputScreen,
  Input,
  SelectableInput,
  SaveButton,
  SubTitle,
  RadioGroup,
  AppActivityIndicator,
  navBackButton,
} from '@lib/mobile-ui';
import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { generateId, getDateString, isNamedEntity, useFilteredDocList } from '@lib/mobile-hooks';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOutlet, IOrderFormParam } from '../../store/types';
import { getNextDocNumber } from '../../utils/helpers';
import { STATUS_LIST } from '../../utils/constants';

const OrderEditScreen = () => {
  const { id, routeId } = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params || {};
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const orders = useFilteredDocList<IOrderDocument>('order');
  const order = orders?.find((e) => e.id === id);
  const orderType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'order');

  const {
    contact: docContact,
    outlet: docOutlet,
    depart: docDepart,
    number: docNumber,
    documentDate: docDocumentDate,
    onDate: docOnDate,
    status: docStatus,
    comment: docComment,
  } = useSelector((state) => state.app.formParams as IOrderFormParam);

  // Подразделение по умолчанию
  const departSetting = useSelector((state) => state.settings?.userData?.depart?.data);
  const defaultDepart = useMemo(() => (isNamedEntity(departSetting) ? departSetting : undefined), [departSetting]);
  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === docOutlet?.id);

  useEffect(() => {
    if (!docContact && !!docOutlet) {
      dispatch(
        appActions.setFormParams({
          contact: outlet?.company,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docOutlet, outlet?.company]);

  useEffect(() => {
    if (!!docContact && !!docOutlet && docContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          outlet: undefined,
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
          depart: order.head.depart,
          comment: order.head.comment,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(orders);

      const tomorrow = new Date();
      const newDocDate = tomorrow.toISOString();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const newOnDate = tomorrow.toISOString();

      dispatch(
        appActions.setFormParams({
          contact: undefined,
          outlet: undefined,
          number: newNumber,
          onDate: newOnDate,
          documentDate: newDocDate,
          status: 'DRAFT',
          depart: defaultDepart,
          comment: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, order, defaultDepart]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      if (!orderType) {
        setScreenState('idle');
        return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
      }

      if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
        setScreenState('idle');
        return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      const docId = !id ? generateId() : id;
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
            comment: docComment && docComment.trim(),
          },
          lines: [],
          creationDate: newOrderDate,
          editionDate: newOrderDate,
        };
        dispatch(documentActions.addDocument(newOrder));
        navigation.dispatch(StackActions.replace('OrderView', { id: newOrder.id, routeId }));
      } else {
        if (!order) {
          setScreenState('idle');
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
            comment: docComment && docComment.trim(),
          },
          lines: order.lines,
          creationDate: order.creationDate || updatedOrderDate,
          editionDate: updatedOrderDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedOrder }));
        setScreenState('idle');
        navigation.navigate('OrderView', { id, routeId });
      }
    }
  }, [
    orderType,
    docNumber,
    docContact,
    docOutlet,
    docOnDate,
    docDocumentDate,
    id,
    docDepart,
    docComment,
    dispatch,
    navigation,
    order,
    docStatus,
    screenState,
    routeId,
  ]);

  const renderRight = useCallback(
    () => <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />,
    [screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const isBlocked = useMemo(() => docStatus !== 'DRAFT' || !!order?.head.route?.id, [docStatus, order?.head.route?.id]);

  const statusName = useMemo(
    () => (id ? (docStatus === 'DRAFT' ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ'),
    [docStatus, id],
  );

  // Окно календаря для выбора даты
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = useCallback(
    (_event: any, selectedOnDate: Date | undefined) => {
      //Закрываем календарь и записываем выбранную дату
      setShowOnDate(false);

      if (selectedOnDate) {
        dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString() }));
      }
    },
    [dispatch],
  );

  const handlePresentOnDate = useCallback(() => {
    Keyboard.dismiss();
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowOnDate(true);
  }, [docStatus]);

  const handlePresentContact = useCallback(() => {
    if (isBlocked) {
      return;
    }

    if (order?.head.route?.id) {
      return Alert.alert('Внимание!', 'Нельзя менять организацию! Документ заявки привязан к маршруту.', [
        { text: 'OK' },
      ]);
    }

    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact && [docContact],
    });
  }, [docContact, isBlocked, navigation, order?.head.route?.id]);

  const handlePresentOutlet = useCallback(() => {
    if (isBlocked) {
      return;
    }

    if (order?.head.route?.id) {
      return Alert.alert('Внимание!', 'Нельзя менять магазин! Документ заявки привязан к маршруту.', [{ text: 'OK' }]);
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
      descrFieldName: 'address',
    });
  }, [docContact?.id, docOutlet, isBlocked, navigation, order?.head.route?.id]);

  const handlePresentDepart = useCallback(() => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'depart',
      value: docDepart && [docDepart],
    });
  }, [docDepart, isBlocked, navigation]);

  const handleChangeStatus = useCallback(() => {
    dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
  }, [dispatch, docStatus]);

  const handleChangeNumber = useCallback(
    (text: string) => dispatch(appActions.setFormParams({ number: text.trim() })),
    [dispatch],
  );

  const viewStyle = useMemo(
    () => [
      localStyles.switchContainer,
      localStyles.border,
      { borderColor: colors.primary, backgroundColor: colors.card },
    ],
    [colors.card, colors.primary],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={viewStyle}>
          <RadioGroup
            options={STATUS_LIST}
            onChange={handleChangeStatus}
            activeButtonId={STATUS_LIST.find((i) => i.id === docStatus)?.id}
            directionRow={true}
          />
        </View>
        <Input label="Номер" value={docNumber} onChangeText={handleChangeNumber} disabled={isBlocked} />
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
        <Input
          label="Комментарий"
          value={docComment}
          onChangeText={(text) => {
            dispatch(appActions.setFormParams({ comment: text || '' }));
          }}
          disabled={docStatus !== 'DRAFT'}
          clearInput={true}
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
