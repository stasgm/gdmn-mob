import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme, useIsFocused } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
import { AppInputScreen, Input, SaveButton, SubTitle, RadioGroup, AppActivityIndicator } from '@lib/mobile-ui';
import { IDepartment, IDocumentType, IReference } from '@lib/types';

import { getDateString } from '@lib/mobile-app';

import { OrderStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderFormParam, IOtvesDocument } from '../../store/types';

import { navBackButton } from '../../components/navigateOptions';
import { STATUS_LIST } from '../../utils/constants';

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrderStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OrderEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const temps = docSelectors.selectByDocType<IOtvesDocument>('otves');
  const otves = temps?.find((e) => e.id === id);

  const number1 = otves?.number;
  const contact1 = otves?.head.contact;
  const outlet1 = otves?.head.outlet;
  const onDate1 = otves?.head.onDate;

  const otvesType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'otves');

  const formParams = useSelector((state) => state.app.formParams as IOrderFormParam);

  // Подразделение по умолчанию
  const depart = useSelector((state) => state.auth.user?.settings?.depart?.data) as IDepartment;

  const { documentDate: docDocumentDate, status: docStatus } = useMemo(() => {
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
    if (otves) {
      dispatch(
        appActions.setFormParams({
          documentDate: otves.documentDate,
          status: otves.status,
          depart: otves.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          // depart: defaultDepart,
        }),
      );
    }
  }, [dispatch, otves]);

  const handleSave = useCallback(() => {
    if (!otvesType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    if (!(/*docNumber  && docContact && docOutlet && docOnDate &&*/ docDocumentDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    if (id) {
      if (!otves) {
        return;
      }

      const updatedOrderDate = new Date().toISOString();

      const updatedOrder: IOrderDocument = {
        ...otves,
        id,
        status: docStatus || 'DRAFT',
        documentDate: docDocumentDate,
        documentType: otvesType,
        creationDate: otves.creationDate || updatedOrderDate,
        editionDate: updatedOrderDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedOrder }));
      navigation.navigate('TempView', { id });
    }
  }, [otvesType, docDocumentDate, id, otves, docStatus, dispatch, navigation]);

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

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
        <Input label="Склад" value={depart?.name} disabled={true} />
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
