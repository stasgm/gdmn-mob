import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

import { DashboardStackParamList } from '@lib/mobile-navigation';

import { ShipmentStackParamList } from '../../navigation/Root/types';
import { IShipmentFormParam, IShipmentDocument } from '../../store/types';

import { STATUS_LIST } from '../../utils/constants';
import { alertWithSound } from '../../utils/helpers';

const ShipmentEditScreen = () => {
  const { id, isCurr } = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentEdit'>>().params;
  const navigation =
    useNavigation<StackNavigationProp<ShipmentStackParamList & DashboardStackParamList, 'ShipmentEdit'>>();
  const navState = navigation.getState();
  const screenName = navState.routes.some((route) => route.name === 'Dashboard')
    ? 'ShipmentEditScreenDashboard'
    : 'ShipmentEditScreen';

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
    ?.data.find((t) => (isCurr ? t.name === 'currShipment' : t.name === 'shipment'));

  const forms = useSelector((state) => state.app.screenFormParams);

  const {
    documentDate: docDocumentDate,
    status: docStatus,
    fromDepart: docFromDepart,
  } = (forms && forms[screenName] ? forms[screenName] : {}) as IShipmentFormParam;

  useEffect(() => {
    return () => {
      dispatch(appActions.clearScreenFormParams(screenName));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Инициализируем параметры
    if (shipment) {
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: {
            documentDate: shipment.documentDate,
            status: shipment.status,
            fromDepart: shipment.head?.fromDepart,
          },
        }),
      );
    } else {
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: {
            documentDate: new Date().toISOString(),
            status: 'DRAFT',
          },
        }),
      );
    }
  }, [dispatch, screenName, shipment]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!shipmentType) {
        alertWithSound('Ошибка!', 'Тип документа для заявок не найден.');
        setScreenState('idle');
        return;
      }

      if (!docDocumentDate || !docFromDepart) {
        alertWithSound('Ошибка!', 'Не все поля заполнены.');
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
          head: { ...shipment.head, fromDepart: docFromDepart },
          creationDate: shipment.creationDate || updatedShipmentDate,
          editionDate: updatedShipmentDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedShipment }));
        setScreenState('idle');
        navigation.navigate('ShipmentView', { id, isCurr });
      }
    }
  }, [
    shipmentType,
    docDocumentDate,
    id,
    shipment,
    docStatus,
    dispatch,
    navigation,
    screenState,
    docFromDepart,
    isCurr,
  ]);

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
      title: isCurr ? 'Отвес $' : 'Отвес',
    });
  }, [isCurr, navigation, renderRight]);

  const isBlocked = useMemo(() => docStatus !== 'DRAFT', [docStatus]);

  const statusName = useMemo(
    () => (id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ'),
    [id, isBlocked],
  );

  const handleChangeStatus = useCallback(() => {
    dispatch(
      appActions.setScreenFormParams({
        screenName,
        params: { status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' },
      }),
    );
  }, [dispatch, docStatus, screenName]);

  const handleDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      screenName,
      refName: 'depart',
      fieldName: 'fromDepart',
      value: docFromDepart && [docFromDepart],
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
        <SelectableInput label="Склад" value={docFromDepart?.name} disabled={true} onPress={handleDepart} />
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
