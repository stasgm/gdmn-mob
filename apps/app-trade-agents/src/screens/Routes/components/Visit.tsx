import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, Alert, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { docSelectors, documentActions, refSelectors, useDocThunkDispatch, useSelector } from '@lib/store';
import { IDocumentType, INamedEntity } from '@lib/types';
import {
  InfoBlock,
  ItemSeparator,
  PrimeButton,
  ScreenListItem,
  IListItemProps,
  EmptyList,
  MediumText,
  AppActivityIndicator,
} from '@lib/mobile-ui';
import { useSendDocs, getDateString, generateId, keyExtractor } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { useDispatch } from '../../../store';
import { IOrderDocument, IVisitDocument } from '../../../store/types';
import { getCurrentPosition } from '../../../utils/expoFunctions';
import { getTimeProcess, twoDigits } from '../../../utils/helpers';
import { navBackButton } from '../../../components/navigateOptions';
import { RoutesStackParamList } from '../../../navigation/Root/types';

interface IVisitProps {
  visit: IVisitDocument;
  outlet: INamedEntity;
  contact: INamedEntity;
  route: INamedEntity;
}

const Visit = ({ visit, outlet, contact, route }: IVisitProps) => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteDetails'>>();

  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const [process, setProcess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const dateBegin = useMemo(() => new Date(visit.head.dateBegin), [visit.head.dateBegin]);
  const dateEnd = useMemo(() => (visit.head.dateEnd ? new Date(visit.head.dateEnd) : undefined), [visit.head.dateEnd]);

  // Подразделение по умолчанию
  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data) as INamedEntity | undefined;

  const orderDocs = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((doc) => doc.head?.route?.id === route.id && doc.head.outlet?.id === outlet.id);

  const orderType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'order');

  const handleCloseVisit = useCallback(async () => {
    // TODO Вынести в async actions
    setProcess(true);

    const coords = await getCurrentPosition();

    const date = new Date().toISOString();

    const updatedVisit: IVisitDocument = {
      ...visit,
      head: {
        ...visit.head,
        dateEnd: date,
        endGeoPoint: coords,
      },
      creationDate: visit.creationDate || date,
      editionDate: date,
    };

    const updatedOrders: IOrderDocument[] = [];
    orderDocs.forEach((doc) => {
      if (doc.status === 'DRAFT') {
        updatedOrders.push({ ...doc, status: 'READY', creationDate: doc.creationDate || date, editionDate: date });
      }
    });
    await docDispatch(documentActions.updateDocuments([updatedVisit, ...updatedOrders]));

    setProcess(false);
  }, [docDispatch, visit, orderDocs]);

  const handleReopenVisit = useCallback(async () => {
    setProcess(true);

    const date = new Date().toISOString();

    const updatedVisit: IVisitDocument = {
      ...visit,
      head: {
        ...visit.head,
        dateEnd: undefined,
        endGeoPoint: undefined,
      },
      editionDate: date,
    };
    await docDispatch(documentActions.updateDocuments([updatedVisit]));

    setProcess(false);
  }, [docDispatch, visit]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleNewOrder = useCallback(() => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
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
        takenOrder: visit.head.takenType,
        depart: defaultDepart,
      },
      lines: [],
      creationDate: newOrderDate,
      editionDate: newOrderDate,
    };

    dispatch(documentActions.addDocument(newOrder));

    navigation.navigate('OrderView', { id: newOrder.id });
  }, [contact, defaultDepart, dispatch, navigation, orderType, outlet, route, visit.head.takenType]);

  const visitTextBegin = useMemo(
    () =>
      `Начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
        !dateEnd ? 'тся' : 'лся'
      } ${getTimeProcess(visit.head.dateBegin, visit.head.dateEnd)})`,
    [dateBegin, dateEnd, visit.head.dateBegin, visit.head.dateEnd],
  );

  const visitTextEnd = useMemo(
    () => dateEnd && `Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`,
    [dateEnd],
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

  const renderOrderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => <ScreenListItem {...item} onPress={() => navigation.navigate('OrderView', { id: item.id })} />,
    [navigation],
  );

  const readyDocs = orderDocs.filter((doc) => doc.status === 'READY');

  const sendDoc = useSendDocs(readyDocs);

  const handleSendDocs = async () => {
    sendDoc();
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <>
      <View style={localStyles.container}>
        <InfoBlock colorLabel="#7d0656" title="Визит">
          <>
            <MediumText>{visitTextBegin}</MediumText>
            {dateEnd && <MediumText>{visitTextEnd}</MediumText>}
            {
              <>
                {!dateEnd ? (
                  <PrimeButton
                    icon={!process ? 'stop-circle-outline' : 'block-helper'}
                    onPress={handleCloseVisit}
                    outlined={true}
                    disabled={process}
                  >
                    Завершить визит
                  </PrimeButton>
                ) : (
                  readyDocs.length <= 0 && (
                    <PrimeButton
                      icon={!process ? 'play-circle-outline' : 'block-helper'}
                      onPress={handleReopenVisit}
                      outlined={true}
                      disabled={process}
                    >
                      Возобновить визит
                    </PrimeButton>
                  )
                )}
              </>
            }
          </>
        </InfoBlock>
        <View style={localStyles.orderView}>
          {orders.length > 0 && (
            <InfoBlock colorLabel="#567d06" title="Заявки">
              <View style={localStyles.list}>
                <FlatList
                  data={orders}
                  keyExtractor={keyExtractor}
                  renderItem={renderOrderItem}
                  scrollEventThrottle={400}
                  ItemSeparatorComponent={ItemSeparator}
                  ListEmptyComponent={EmptyList}
                />
              </View>
            </InfoBlock>
          )}
        </View>
        {!dateEnd ? (
          <PrimeButton icon="plus-circle-outline" onPress={handleNewOrder}>
            Добавить документ
          </PrimeButton>
        ) : (
          readyDocs.length > 0 &&
          !sendLoading && (
            <PrimeButton
              icon={!sendLoading ? 'file-send' : 'block-helper'}
              onPress={async () => {
                if (!sendLoading) {
                  setSendLoading(true);
                  await handleSendDocs();
                  setSendLoading(false);
                }
              }}
              disabled={sendLoading}
              loadIcon={sendLoading}
            >
              Отправить
            </PrimeButton>
          )
        )}
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderView: {
    flex: 1,
    display: 'flex',
  },
  list: {
    maxHeight: 240,
  },
});

export default Visit;
