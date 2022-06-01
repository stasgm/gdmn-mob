import React, { useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
import { INamedEntity } from '@lib/types';
import { SubTitle, globalStyles as styles, InfoBlock, PrimeButton, AppScreen } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { formatValue, generateId, getDateString } from '@lib/mobile-app';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument, IVisitDocument, visitDocumentType } from '../../store/types';
import { ICoords } from '../../store/geo/types';
import { getCurrentPosition } from '../../utils/expoFunctions';

import { navBackButton } from '../../components/navigateOptions';

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
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const point = docSelectors.selectByDocId<IRouteDocument>(routeId)?.lines.find((i) => i.id === id);

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

  if (!outlet) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>{`Магазин ${point.outlet.name} не найден в справочниках`}</SubTitle>
      </View>
    );
  }

  const contact = outlet
    ? refSelectors.selectByName<IContact>('contact').data?.find((item) => item.id === outlet?.company.id)
    : undefined;

  const debt = contact
    ? refSelectors.selectByName<IDebt>('debt').data.find((item) => item.id === contact.id)
    : undefined;

  const saldo = debt?.saldo ?? 0;
  const saldoDebt = debt?.saldoDebt ?? 0;

  const handleNewVisit = async () => {
    setProcess(true);

    let coords: ICoords | undefined;

    try {
      coords = await getCurrentPosition();

      const date = new Date().toISOString();
      const visitId = generateId();

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
    } catch (e) {
      // setMessage(e.message);
      // setBarVisible(true);
      // console.log('err', e);
    }
    setProcess(false);
  };

  return (
    <AppScreen style={styles.contentTop}>
      <InfoBlock colorLabel={'#06567D'} title={point.outlet.name}>
        <>
          {outlet && (
            <>
              <Text style={[styles.textLow, { color: colors.text }]}>{outlet.address}</Text>
              <Text style={[styles.textLow, { color: colors.text }]}>{outlet.phoneNumber}</Text>
            </>
          )}
        </>
      </InfoBlock>
      <InfoBlock
        colorLabel={'#a91160'}
        title={`Договор №${contact?.contractNumber || '-'} от ${contact ? getDateString(contact.contractDate) : '-'}`}
      >
        <>
          {contact && (
            <>
              <Text style={[styles.textLow, { color: colors.text }]}>{`Условия оплаты: ${contact.paycond}`}</Text>
              <Text style={[styles.textLow, { color: colors.text }]}>
                {saldo < 0
                  ? `Предоплата: ${formatValue({ type: 'number', decimals: 2 }, Math.abs(saldo) ?? 0)}`
                  : `Задолженность: ${formatValue({ type: 'number', decimals: 2 }, saldo)}`}
              </Text>
              <Text style={[styles.textLow, { color: saldoDebt <= 0 ? colors.text : colors.notification }]}>
                {`Просроченная задолженность: ${formatValue({ type: 'number', decimals: 2 }, saldoDebt ?? 0)}`}
              </Text>
            </>
          )}
        </>
      </InfoBlock>
      {visits.length > 0 && !process ? (
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
        <PrimeButton icon="play-circle-outline" onPress={handleNewVisit} disabled={process}>
          Начать визит
        </PrimeButton>
      )}
    </AppScreen>
  );
};

export default RouteDetailScreen;
