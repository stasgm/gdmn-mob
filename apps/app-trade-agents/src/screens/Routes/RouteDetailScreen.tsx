import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ListRenderItem, FlatList, Alert, TouchableHighlight } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  SubTitle,
  globalStyles as styles,
  InfoBlock,
  AppScreen,
  MediumText,
  AppActivityIndicator,
  navBackButton,
  LargeText,
  SendButton,
  AddButton,
  ItemSeparator,
  EmptyList,
  ScreenListItem,
  IListItemProps,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { formatValue, generateId, getDateString, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { IDocumentType, INamedEntity } from '@lib/types';

import { Divider, useTheme } from 'react-native-paper';

import { RoutesStackParamList } from '../../navigation/Root/types';
import {
  IContact,
  IDebt,
  IOrderDocument,
  IOutlet,
  IRouteDocument,
  IVisitDocument,
  visitDocumentType,
} from '../../store/types';
import { ICoords } from '../../store/geo/types';
import { getCurrentPosition } from '../../utils/expoFunctions';
import { lineTypes } from '../../utils/constants';

const RouteDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteDetails'>>();
  const { colors } = useTheme();

  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;

  const route = useMemo(() => ({ id: routeId, name: '' } as INamedEntity), [routeId]);

  const visit = docSelectors.selectByDocType<IVisitDocument>('visit')?.find((e) => e.head.routeLineId === id);

  const [process, setProcess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const [lineType, setLineType] = useState(lineTypes[0].id);

  const point = docSelectors.selectByDocId<IRouteDocument>(routeId)?.lines.find((i) => i.id === id);

  const outlet = point ? refSelectors.selectByRefId<IOutlet>('outlet', point?.outlet.id) : undefined;

  const contact = outlet ? refSelectors.selectByRefId<IContact>('contact', outlet.company.id) : undefined;

  const debt = contact ? refSelectors.selectByRefId<IDebt>('debt', contact.id) : undefined;

  const saldo = debt?.saldo ?? 0;
  const saldoDebt = debt?.saldoDebt ?? 0;

  const debtTextStyle = [{ color: saldoDebt > 0 ? colors.error : colors.text }];

  const orderType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'order');

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data) as INamedEntity | undefined;

  const orderDocs = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((doc) => doc.head?.route?.id === route.id && doc.head.outlet?.id === outlet?.id);

  const orderDocsOld = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((doc) => doc.head.outlet?.id === outlet?.id && !orderDocs.find((a) => a.id === doc.id))
    .sort(
      (a, b) =>
        new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
        new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
    );

  const orders: IListItemProps[] = useMemo(() => {
    return orderDocs.map((i) => {
      const creationDate = new Date(i.editionDate || i.creationDate || 0);
      return {
        id: i.id,
        title: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
        documentDate: getDateString(i.documentDate),
        status: i.status,
        subtitle: `${getDateString(creationDate)} ${creationDate.toLocaleTimeString()}`,
        isFromRoute: false,
        lineCount: i.lines.length,
      } as IListItemProps;
    });
  }, [orderDocs]);

  const ordersOld: IListItemProps[] = useMemo(() => {
    return orderDocsOld.map((i) => {
      const creationDate = new Date(i.editionDate || i.creationDate || 0);
      return {
        id: i.id,
        title: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
        documentDate: getDateString(i.documentDate),
        status: i.status,
        subtitle: `${getDateString(creationDate)} ${creationDate.toLocaleTimeString()}`,
        isFromRoute: false,
        lineCount: i.lines.length,
      } as IListItemProps;
    });
  }, [orderDocsOld]);

  const handleNewVisit = useCallback(async () => {
    setProcess(true);

    if (!orderType) {
      setProcess(false);

      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    if (!contact || !outlet) {
      setProcess(false);

      return Alert.alert('Ошибка!', 'Магазин не найден', [{ text: 'OK' }]);
    }

    let coords: ICoords | undefined;

    try {
      if (!orderDocs.find((i) => i.head.route)) {
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
      }

      const newOrderDate = new Date().toISOString();
      const newOnDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

      const newOrder: IOrderDocument = {
        id: generateId(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newOrderDate,
        documentType: orderType,
        head: {
          contact,
          outlet,
          route,
          onDate: newOnDate,
          takenOrder: visit?.head.takenType,
          depart: defaultDepart,
        },
        lines: [],
        creationDate: newOrderDate,
        editionDate: newOrderDate,
      };

      dispatch(documentActions.addDocument(newOrder));

      navigation.navigate('OrderView', { id: newOrder.id, routeId: route.id });
    } catch (e) {
      // console.log('err', e);
    }
    setProcess(false);
  }, [contact, defaultDepart, dispatch, id, navigation, orderDocs, orderType, outlet, route, visit?.head.takenType]);

  const sendDoc = useSendDocs(orderDocs.filter((i) => i.status === 'DRAFT' || i.status === 'READY'));

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SendButton
          onPress={async () => {
            setSendLoading(true);
            await sendDoc();
            setSendLoading(false);
            navigation.navigate('RouteView', { id: route.id });
          }}
          disabled={sendLoading || process}
        />
        <AddButton onPress={handleNewVisit} disabled={process} />
      </View>
    ),
    [handleNewVisit, navigation, process, route.id, sendDoc, sendLoading],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const LineTypes = useCallback(
    () => (
      <View style={styles.containerCenter}>
        {lineTypes.map((e, i) => {
          return (
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor="#DDDDDD"
              key={e.id}
              style={[
                styles.btnTab,
                i === 0 && styles.firstBtnTab,
                i === lineTypes.length - 1 && styles.lastBtnTab,
                e.id === lineType && { backgroundColor: colors.primary },
                { borderColor: colors.primary },
              ]}
              onPress={() => setLineType(e.id)}
            >
              <LargeText style={{ color: e.id === lineType ? colors.background : colors.text }}>{e.value}</LargeText>
            </TouchableHighlight>
          );
        })}
      </View>
    ),
    [colors.background, colors.primary, colors.text, lineType],
  );

  const renderOrderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => (
      <ScreenListItem {...item} onPress={() => navigation.navigate('OrderView', { id: item.id, routeId: route.id })} />
    ),
    [navigation, route.id],
  );

  const renderOrderOldItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => (
      <ScreenListItem {...item} onPress={() => navigation.navigate('OrderView', { id: item.id, routeId: route.id })} />
    ),
    [navigation, route.id],
  );

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
          <Divider />
          <LargeText style={localStyles.contract}>{`Договор №${contact.contractNumber || '-'} от ${getDateString(
            contact.contractDate,
          )}`}</LargeText>
          {contact && (
            <>
              <Divider />

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
            </>
          )}
        </>
      </InfoBlock>

      <LineTypes />

      {lineType === 'new' ? (
        <FlatList
          data={orders}
          keyExtractor={keyExtractor}
          renderItem={renderOrderItem}
          scrollEventThrottle={400}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={EmptyList}
        />
      ) : (
        <FlatList
          data={ordersOld}
          keyExtractor={keyExtractor}
          renderItem={renderOrderOldItem}
          scrollEventThrottle={400}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={EmptyList}
        />
      )}
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  contract: { fontWeight: '500', fontSize: 15 },
});

export default RouteDetailScreen;
