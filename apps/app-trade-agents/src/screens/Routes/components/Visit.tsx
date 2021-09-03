import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors } from '@lib/store';
import { BackButton, InfoBlock, PrimeButton } from '@lib/mobile-ui';
import { IDocumentType, INamedEntity } from '@lib/types';

import { useDispatch } from '../../../store';
import { IOrderDocument, IReturnDocument, IVisitDocument } from '../../../store/types';
import { ICoords } from '../../../store/geo/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';
import { getCurrentPosition } from '../../../utils/expoFunctions';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteDetails'>;

const Visit = ({
  item,
  outlet,
  contact,
  route,
}: {
  item: IVisitDocument;
  outlet: INamedEntity;
  contact: INamedEntity;
  route: INamedEntity;
}) => {
  const navigation = useNavigation<RouteLineProp>();
  const dispatch = useDispatch();

  const [process, setProcess] = useState(false);

  const dateBegin = new Date(item.head.dateBegin);
  const dateEnd = item.head.dateEnd ? new Date(item.head.dateEnd) : undefined;

  console.log('outlet', outlet);

  const order = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.find((e) => e.head.route?.id === route.id && e.head.outlet.id === outlet.id);

  const orderType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'order');

  const returnDoc = docSelectors
    .selectByDocType<IReturnDocument>('return')
    ?.find((e) => e.head.route?.id === route.id && e.head.outlet.id === outlet.id);

  const returnType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'return');

  const timeProcess = () => {
    // TODO Вынести в helpers
    const diffMinutes = Math.floor(
      ((item.head.dateEnd ? Date.parse(item.head.dateEnd) : Date.now()) - Date.parse(item.head.dateBegin)) / 60000,
    );
    const hour = Math.floor(diffMinutes / 60);
    return `${hour} часов ${diffMinutes - hour * 60} минут`;
  };

  const twoDigits = (value: number) => {
    // TODO Вынести в helpers
    return value >= 10 ? value : `0${value}`;
  };

  const handleCloseVisit = async () => {
    // TODO Вынести в async actions
    setProcess(true);

    let coords: ICoords | undefined;

    try {
      coords = await getCurrentPosition();
    } catch (e) {
      // setMessage(e.message);
      // setBarVisible(true);
    }

    const date = new Date().toISOString();

    const updatedVisit: IVisitDocument = {
      ...item,
      head: {
        ...item.head,
        dateEnd: date,
        endGeoPoint: coords,
      },
      creationDate: item.creationDate || date,
      editionDate: date,
    };

    dispatch(
      documentActions.updateDocument({
        docId: item.id,
        document: updatedVisit,
      }),
    );

    setProcess(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const handleNewOrder = () => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    const newOrderDate = new Date().toISOString();

    const newOrder: IOrderDocument = {
      id: uuid(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newOrderDate,
      documentType: orderType,
      head: {
        contact,
        outlet,
        route,
        onDate: newOrderDate,
        takenOrder: item.head.takenType,
      },
      lines: [],
      creationDate: newOrderDate,
      editionDate: newOrderDate,
    };

    dispatch(documentActions.addDocument(newOrder));

    navigation.navigate('OrderView', { id: newOrder.id });
  };

  const handleNewReturn = () => {
    if (!returnType) {
      return Alert.alert('Ошибка!', 'Тип документа для возврата не найден', [{ text: 'OK' }]);
    }

    const newReturnDate = new Date().toISOString();

    const newReturn: IReturnDocument = {
      id: uuid(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newReturnDate,
      documentType: returnType,
      head: {
        contact,
        outlet,
        // depart: deprt1,
        route,
        reason: 'Брак',
      },
      lines: [],
      creationDate: newReturnDate,
      editionDate: newReturnDate,
    };

    dispatch(documentActions.addDocument(newReturn));

    navigation.navigate('ReturnView', { id: newReturn.id });
  };

  const visitTextBegin = `Начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
    !dateEnd ? 'тся' : 'лся'
  } ${timeProcess()})`;
  const visitTextEnd = dateEnd && `Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`;

  const orderText = `Заявка (${order ? `${order.lines.length}` : '0'})`;
  const handleOrder = () => {
    return order ? navigation.navigate('OrderView', { id: order.id }) : handleNewOrder();
  };

  const returnText = `Возврат (${returnDoc ? `${returnDoc.lines.length}` : '0'})`;
  const handleReturn = () => {
    return returnDoc ? navigation.navigate('ReturnView', { id: returnDoc.id }) : handleNewReturn();
  };

  return (
    <>
      <InfoBlock colorLabel="#4E9600" title="Визит">
        <>
          <Text>{visitTextBegin}</Text>
          {dateEnd ? (
            <Text>{visitTextEnd}</Text>
          ) : (
            <View>
              <PrimeButton icon="clipboard-arrow-right-outline" onPress={handleOrder} outlined>
                {orderText}
              </PrimeButton>
              <PrimeButton icon="clipboard-arrow-left-outline" onPress={handleReturn} outlined>
                {returnText}
              </PrimeButton>
            </View>
          )}
        </>
      </InfoBlock>
      {process ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!dateEnd && (
            <PrimeButton icon="stop-circle-outline" onPress={handleCloseVisit}>
              Завершить визит
            </PrimeButton>
          )}
        </>
      )}
    </>
  );
};

export default Visit;
