import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
import {
  SubTitle,
  globalStyles as styles,
  InfoBlock,
  PrimeButton,
  AppScreen,
  MediumText,
  AppActivityIndicator,
  navBackButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { formatValue, generateId, getDateString } from '@lib/mobile-app';

import { INamedEntity } from '@lib/types';

import { useTheme } from 'react-native-paper';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument, IVisitDocument, visitDocumentType } from '../../store/types';
import { ICoords } from '../../store/geo/types';
import { getCurrentPosition } from '../../utils/expoFunctions';

import Visit from './components/Visit';

const RouteDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteDetails'>>();
  const { colors } = useTheme();

  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;

  const route = { id: routeId, name: '' } as INamedEntity;

  const visit = docSelectors.selectByDocType<IVisitDocument>('visit')?.find((e) => e.head.routeLineId === id);

  const [process, setProcess] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const point = docSelectors.selectByDocId<IRouteDocument>(routeId)?.lines.find((i) => i.id === id);

  const outlet = point ? refSelectors.selectByRefId<IOutlet>('outlet', point?.outlet.id) : undefined;

  const contact = outlet ? refSelectors.selectByRefId<IContact>('contact', outlet.company.id) : undefined;

  const debt = contact ? refSelectors.selectByRefId<IDebt>('debt', contact.id) : undefined;

  const saldo = debt?.saldo ?? 0;
  const saldoDebt = debt?.saldoDebt ?? 0;

  const debtTextStyle = [{ color: saldoDebt > 0 ? colors.error : colors.text }];

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

  const isFocused = useIsFocused();

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

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen style={styles.contentTop}>
      <InfoBlock colorLabel={'#06567D'} title={point.outlet.name}>
        <>
          {outlet && (
            <>
              <MediumText>{outlet.address}</MediumText>
              <MediumText>{outlet.phoneNumber}</MediumText>
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
              <MediumText>{`Условия оплаты: ${contact.paycond}`}</MediumText>
              <MediumText>
                {saldo < 0
                  ? `Предоплата: ${formatValue({ type: 'currency', decimals: 2 }, Math.abs(saldo) ?? 0)}`
                  : `Задолженность: ${formatValue({ type: 'currency', decimals: 2 }, saldo)}`}
              </MediumText>
              {!!debt?.saldoDebt && (
                <MediumText style={debtTextStyle}>
                  {`Просрочено: ${formatValue({ type: 'currency', decimals: 2 }, saldoDebt ?? 0)}, ${debt.dayLeft} дн.`}
                </MediumText>
              )}
              {/* <MediumText>Количество дней: {debt?.dayLeft || 0}</MediumText> */}
            </>
          )}
        </>
      </InfoBlock>
      {visit && !process ? (
        <Visit key={visit.id} visit={visit} outlet={outlet} contact={contact} route={route} />
      ) : (
        <PrimeButton icon="play-circle-outline" onPress={handleNewVisit} disabled={process}>
          Начать визит
        </PrimeButton>
      )}
    </AppScreen>
  );
};

export default RouteDetailScreen;
