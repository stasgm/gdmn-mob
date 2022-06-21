import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
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
  const visit = docSelectors.selectByDocType<IVisitDocument>('visit')?.find((e) => e.head.routeLineId === id);

  const [process, setProcess] = useState(false);
  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const point = docSelectors.selectByDocId<IRouteDocument>(routeId)?.lines.find((i) => i.id === id);

  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const outlet = useMemo(() => (point ? outlets?.find((e) => e.id === point?.outlet.id) : undefined), [point, outlets]);

  const contacts = refSelectors.selectByName<IContact>('contact')?.data;

  const contact = useMemo(
    () => (outlet ? contacts?.find((item) => item.id === outlet.company.id) : undefined),
    [contacts, outlet],
  );

  const debts = refSelectors.selectByName<IDebt>('debt')?.data;

  const debt = useMemo(() => (contact ? debts?.find((item) => item.id === contact.id) : undefined), [contact, debts]);

  const saldo = debt?.saldo ?? 0;
  const saldoDebt = debt?.saldoDebt ?? 0;

  const debtTextStyle = useMemo(
    () => [styles.textLow, { color: saldoDebt > 0 ? colors.notification : colors.text }],
    [colors.notification, colors.text, saldoDebt],
  );

  const handleNewVisit = useCallback(async () => {
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
      // console.log('err', e);
    }
    setProcess(false);
  }, [dispatch, id]);

  if (!point) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>Точки маршрута не найдены</SubTitle>
      </View>
    );
  }

  if (!outlet) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>{`Магазин ${point.outlet.name} не найден в справочниках`}</SubTitle>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>Организация не найдена в справочниках</SubTitle>
      </View>
    );
  }

  return (
    <AppScreen style={styles.contentTop}>
      <InfoBlock colorLabel={'#06567D'} title={point.outlet.name}>
        <>
          {outlet && (
            <>
              <Text style={textStyle}>{outlet.address}</Text>
              <Text style={textStyle}>{outlet.phoneNumber}</Text>
            </>
          )}
        </>
      </InfoBlock>
      <InfoBlock
        colorLabel={'#a91160'}
        title={`Договор №${contact.contractNumber || '-'} от ${getDateString(contact.contractDate)}`}
      >
        <>
          {contact && (
            <>
              <Text style={textStyle}>{`Условия оплаты: ${contact.paycond}`}</Text>
              <Text style={textStyle}>
                {saldo < 0
                  ? `Предоплата: ${formatValue({ type: 'number', decimals: 2 }, Math.abs(saldo) ?? 0)}`
                  : `Задолженность: ${formatValue({ type: 'number', decimals: 2 }, saldo)}`}
              </Text>
              <Text style={debtTextStyle}>
                {`Просроченная задолженность: ${formatValue({ type: 'number', decimals: 2 }, saldoDebt ?? 0)}`}
              </Text>
              <Text style={textStyle}>Количество дней: {debt?.dayLeft || 0}</Text>
            </>
          )}
        </>
      </InfoBlock>
      {visit && !process ? (
        <Visit key={visit.id} item={visit} outlet={outlet} contact={contact} route={{ id: routeId, name: '' }} />
      ) : (
        <PrimeButton icon="play-circle-outline" onPress={handleNewVisit} disabled={process}>
          Начать визит
        </PrimeButton>
      )}
    </AppScreen>
  );
};

export default RouteDetailScreen;
