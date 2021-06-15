import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors } from '@lib/store';
import { INamedEntity, IReference } from '@lib/types';
import { SubTitle, globalStyles as styles, InfoBlock, PrimeButton, AppScreen, BackButton } from '@lib/mobile-ui';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument } from '../../store/docs/types';

import { contactRefMock, outletRefMock } from '../../store/docs/mock';
import { useDispatch, useSelector } from '../../store';

import { visitActions } from '../../store/visits/actions';

import { ICoords } from '../../store/geo/types';

import { getDateString } from '../../utils/helpers';

import { getCurrentPosition } from '../../utils/expoFunctions';

import Visit from './components/Visit';

const RouteDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;
  const visits = useSelector((state) => state.visits).list.filter((visit) => visit.routeLineId.toString() === id);

  const [process, setProcess] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

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

    let coords: ICoords | undefined;

    try {
      coords = await getCurrentPosition();
    } catch (e) {
      // setMessage(e.message);
      // setBarVisible(true);
    }

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
    <AppScreen style={styles.contentTop}>
      <InfoBlock colorLabel="#4479D4" title={point.outlet.name}>
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
        colorLabel={debt.saldo > 0 ? '#FC3F4D' : '#00C322'}
        title={`Договор №${contact?.contractNumber || '-'} от ${contact ? getDateString(contact.contractDate) : '-'}`}
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : visits.length > 0 ? (
        <>
          {visits.map((visit) => (
            <Visit
              key={visit.id}
              item={visit}
              outlet={outlet as INamedEntity}
              contact={contact as INamedEntity}
              route={{ id: routeId, name: '' }}
            />
          ))}
        </>
      ) : (
        <PrimeButton icon="play-circle-outline" onPress={handleNewVisit}>
          Начать визит
        </PrimeButton>
      )}
    </AppScreen>
  );
};

export default RouteDetailScreen;
