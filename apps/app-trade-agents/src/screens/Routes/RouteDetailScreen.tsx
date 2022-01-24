import React, { useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
import { INamedEntity } from '@lib/types';
import { SubTitle, globalStyles as styles, InfoBlock, PrimeButton, AppScreen, BackButton } from '@lib/mobile-ui';
import { v4 as uuid } from 'uuid';

import { useTheme } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument, IVisitDocument, visitDocumentType } from '../../store/types';
import { ICoords } from '../../store/geo/types';
import { getDateString } from '../../utils/helpers';
import { getCurrentPosition } from '../../utils/expoFunctions';

import Visit from './components/Visit';

const RouteDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteDetails'>>();
  const { colors } = useTheme();

  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;
  const visits = docSelectors.selectByDocType<IVisitDocument>('visit')?.filter((e) => e.head.routeLineId === id);

  const [process, setProcess] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const point = docSelectors
    .selectByDocType<IRouteDocument>('route')
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
  const outlet = point
    ? refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === point.outlet.id)
    : undefined;

  const contact = outlet
    ? refSelectors.selectByName<IContact>('contact').data?.find((item) => item.id === outlet?.company.id)
    : undefined;

  const debtSaldo = contact
    ? refSelectors.selectByName<IDebt>('debt').data.find((item) => item.contact.id === contact.id)
    : undefined;

  const debt: IDebt = {
    id: '1',
    contact: contact as INamedEntity,
    ondate: '2021-01-01',
    saldo: debtSaldo?.saldo || 0,
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

    const visitId = uuid();

    const newVisit: IVisitDocument = {
      id: visitId,
      documentType: visitDocumentType,
      number: visitId,
      documentDate: date,
      status: 'DRAFT',
      head: {
        routeLineId: id,
        dateBegin: date,
        beginGeoPoint: coords,
        takenType: 'ON_PLACE',
      },
      creationDate: date,
      editionDate: date,
    };

    dispatch(documentActions.addDocument(newVisit));

    setProcess(false);
  };

  return (
    <AppScreen style={styles.contentTop}>
      <InfoBlock colorLabel={colors.placeholder} title={point.outlet.name}>
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
        colorLabel={debt.saldo > 0 ? colors.error : '#a91160'}
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
      {visits.length > 0 ? (
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
