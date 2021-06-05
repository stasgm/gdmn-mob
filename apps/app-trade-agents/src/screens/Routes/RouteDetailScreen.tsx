import React, { useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

import { docSelectors } from '@lib/store';
import { INamedEntity, IReference } from '@lib/types';
import { SubTitle, globalStyles as styles, InfoBlock, PrimeButton } from '@lib/mobile-ui';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument } from '../../store/docs/types';

import { contactRefMock, outletRefMock } from '../../store/docs/mock';
import { useDispatch, useSelector } from '../../store';

import { visitActions } from '../../store/visits/actions';

import { ICoords } from '../../store/geo/types';

import Visit from './components/Visit';

const RouteDetailScreen = () => {
  const dispatch = useDispatch();

  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;
  const visits = useSelector((state) => state.visits).list.filter((visit) => visit.routeLineId.toString() === id);

  const [process, setProcess] = useState(false);

  const point = (docSelectors.selectByDocType('route') as unknown as IRouteDocument[])
    ?.find((e) => e.id === routeId)
    ?.lines.find((i) => i.id === id);

  if (!point) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>Визит не найден</SubTitle>
      </View>
    );
  }

  //TODO получить адрес item.outlet.id
  /*const outlet = point
    ? (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find((e) => e.id === point.outlet.id)
    : undefined;*/
  const outlet = (outletRefMock as unknown as IReference<IOutlet>).data?.find((item) => item.id === point.outlet.id);
  const contact = outlet
    ? (contactRefMock as unknown as IReference<IContact>).data?.find((item) => item.id === outlet?.company.id)
    : undefined;

  const debt: IDebt = {
    id: '1',
    contact: contact as INamedEntity,
    ondate: '2021-01-01',
    saldo: 1000,
    saldoDebt: 0,
  };

  const handleNewVisit = async () => {
    setProcess(true);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setProcess(false);
      return;
    }

    const coords = (await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    })) as unknown as ICoords;

    const date = new Date().toISOString();

    dispatch(
      visitActions.addOne({
        id: `${id}${date}`,
        routeLineId: Number(id),
        dateBegin: date,
        beginGeoPoint: coords,
        takenType: 'ON_PLACE',
      }),
    );

    setProcess(false);
  };

  return (
    <View style={[styles.container, currStyles.content]}>
      <InfoBlock colorLabel="#3914AF" title={point.outlet.name}>
        <>
          {outlet && (
            <>
              <Text>{outlet.address}</Text>
              <Text>{outlet.phoneNumber}</Text>
            </>
          )}
        </>
      </InfoBlock>
      <InfoBlock
        colorLabel={debt.saldo > 0 ? '#F80012' : '#00C322'}
        title={`Договор №${contact?.contractNumber} от ${contact?.contractDate}`}
      >
        <>
          {contact && (
            <>
              <Text>{`Условия оплаты: ${contact.paycond}`}</Text>
              <Text>{`Задолженность: ${debt.saldo}`}</Text>
            </>
          )}
        </>
      </InfoBlock>
      {process ? (
        <ActivityIndicator size="large" color="#3914AF" />
      ) : visits.length > 0 ? (
        <>
          {visits.map((visit) => (
            <Visit
              key={visit.id}
              item={visit}
              outlet={outlet as INamedEntity}
              contact={contact as INamedEntity}
              road={{ id: routeId, name: '' }}
            />
          ))}
        </>
      ) : (
        <PrimeButton icon="play-box-outline" onPress={handleNewVisit}>
          Начать визит
        </PrimeButton>
      )}
    </View>
  );
};

export default RouteDetailScreen;

const currStyles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
  },
});
