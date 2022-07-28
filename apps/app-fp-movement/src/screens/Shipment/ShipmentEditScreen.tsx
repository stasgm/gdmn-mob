import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme, useIsFocused } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
import { AppInputScreen, Input, SaveButton, SubTitle, RadioGroup, AppActivityIndicator } from '@lib/mobile-ui';
import { IDepartment, IDocumentType, IReference } from '@lib/types';

import { getDateString } from '@lib/mobile-app';

import { ShipmentStackParamList } from '../../navigation/Root/types';
import { IShipmentFormParam, IShipmentDocument } from '../../store/types';

import { navBackButton } from '../../components/navigateOptions';
import { STATUS_LIST } from '../../utils/constants';

const ShipmentEditScreen = () => {
  const id = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<'idle' | 'saving'>('idle');

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(id);

  const number = shipment?.number;
  const contact = shipment?.head.contact;
  const outlet = shipment?.head.outlet;
  const onDate = shipment?.head.onDate;

  const shipmentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'shipment');

  const formParams = useSelector((state) => state.app.formParams as IShipmentFormParam);

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
    if (shipment) {
      dispatch(
        appActions.setFormParams({
          documentDate: shipment.documentDate,
          status: shipment.status,
          depart: shipment.head?.depart,
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
  }, [dispatch, shipment]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!shipmentType) {
        return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
      }

      if (!(/*docNumber  && docContact && docOutlet && docOnDate &&*/ docDocumentDate)) {
        return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      if (id) {
        if (!shipment) {
          return;
        }

        const updatedShipmentDate = new Date().toISOString();

        const updatedShipment: IShipmentDocument = {
          ...shipment,
          id,
          status: docStatus || 'DRAFT',
          documentDate: docDocumentDate,
          documentType: shipmentType,
          creationDate: shipment.creationDate || updatedShipmentDate,
          editionDate: updatedShipmentDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedShipment }));
        navigation.navigate('ShipmentView', { id });
      }
    }
  }, [shipmentType, docDocumentDate, id, shipment, docStatus, dispatch, navigation, screenState]);

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
        <Input label="Номер" value={number} disabled={true} />
        <Input label="Дата отгрузки" value={getDateString(onDate || '')} disabled={true} />
        <Input label="Организация" value={contact?.name} disabled={true} />
        <Input label="Магазин" value={outlet?.name} disabled={true} />
        <Input label="Склад" value={depart?.name} disabled={true} />
      </ScrollView>
    </AppInputScreen>
  );
};

export default ShipmentEditScreen;

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
