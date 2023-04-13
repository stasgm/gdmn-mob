import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
import {
  AppInputScreen,
  Input,
  SaveButton,
  SubTitle,
  RadioGroup,
  navBackButton,
  SelectableInput,
} from '@lib/mobile-ui';
import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { getDateString } from '@lib/mobile-hooks';

import { ShipmentStackParamList } from '../../navigation/Root/types';
import { IShipmentFormParam, IShipmentDocument } from '../../store/types';

import { STATUS_LIST } from '../../utils/constants';

const ShipmentEditScreen = () => {
  const id = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(id);

  const number = shipment?.number;
  const contact = shipment?.head.contact;
  const outlet = shipment?.head.outlet;
  const onDate = shipment?.head.onDate;

  const shipmentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'shipment');

  // Подразделение по умолчанию

  const {
    documentDate: docDocumentDate,
    status: docStatus,
    depart: docDepart,
  } = useSelector((state) => state.app.formParams as IShipmentFormParam);

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
        }),
      );
    }
  }, [dispatch, shipment]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!shipmentType) {
        Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (!docDocumentDate || !docDepart) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (id) {
        if (!shipment) {
          setScreenState('idle');
          return;
        }

        const updatedShipmentDate = new Date().toISOString();

        const updatedShipment: IShipmentDocument = {
          ...shipment,
          id,
          status: docStatus || 'DRAFT',
          documentDate: docDocumentDate,
          head: { ...shipment.head, depart: docDepart },
          creationDate: shipment.creationDate || updatedShipmentDate,
          editionDate: updatedShipmentDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedShipment }));
        navigation.navigate('ShipmentView', { id });
      }
      setScreenState('idle');
    }
  }, [shipmentType, docDocumentDate, id, shipment, docStatus, dispatch, navigation, screenState, docDepart]);

  const renderRight = useCallback(
    () => (
      <SaveButton
        onPress={() => {
          // if (screenState !== 'saving') {
          setScreenState('saving');
          // }
        }}
        disabled={screenState === 'saving'}
      />
    ),
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

  const handleDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'depart',
      value: docDepart && [docDepart],
      descrFieldName: 'shcode',
    });
  };

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
        <Input label="Номер" value={number} disabled={true} />
        <Input label="Дата отгрузки" value={getDateString(onDate || '')} disabled={true} />
        <Input label="Организация" value={contact?.name} disabled={true} />
        <Input label="Магазин" value={outlet?.name} disabled={true} />
        <SelectableInput label="Склад" value={docDepart?.name} disabled={true} onPress={handleDepart} />
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
