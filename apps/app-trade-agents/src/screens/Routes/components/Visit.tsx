import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, documentActions } from '@lib/store';
import { globalStyles as styles, BackButton, InfoBlock, PrimeButton } from '@lib/mobile-ui';
import { IDocument, IEntity, INamedEntity, IUserDocument } from '@lib/types';

import { StackNavigationProp } from '@react-navigation/stack';

import { useDispatch } from '../../../store';

import { IVisit } from '../../../store/visits/types';
import { visitActions } from '../../../store/visits/actions';
import { IOrderDocument } from '../../../store/docs/types';
import { ICoords } from '../../../store/geo/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteDetails'>;

const Visit = ({
  item,
  outlet,
  contact,
  road,
}: {
  item: IVisit;
  outlet: INamedEntity;
  contact: INamedEntity;
  road: INamedEntity;
}) => {
  const navigation = useNavigation<RouteLineProp>();
  const dispatch = useDispatch();

  const [process, setProcess] = useState(false);

  const dateBegin = new Date(item.dateBegin);
  const dateEnd = item.dateEnd ? new Date(item.dateEnd) : undefined;

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find(
    (e) => e.head.road?.id === road.id && e.head.outlet.id === outlet.id,
  );

  const timeProcess = () => {
    // TODO Вынести в helpers
    const diffMinutes = Math.floor(
      ((item.dateEnd ? Date.parse(item.dateEnd) : Date.now()) - Date.parse(item.dateBegin)) / 60000,
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
      visitActions.edit({
        id: item.id,
        dateEnd: date,
        endGeoPoint: coords,
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
    const newOrder: IOrderDocument = {
      documentDate: new Date().toISOString(),
      documentType: {
        id: '1',
        name: 'order',
      },
      id: '111' + new Date().toISOString(),
      number: 'б\\н',
      status: 'DRAFT',
      head: {
        contact,
        outlet,
        road,
        ondate: new Date().toISOString(),
        takenOrder: item.takenType,
      },
      lines: [],
    };

    dispatch(documentActions.addDocument(newOrder as unknown as IUserDocument<IDocument, IEntity[]>));

    navigation.navigate('OrderView', { id: newOrder.id });
  };

  const visitTextBegin = `Начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
    !dateEnd ? 'тся' : 'лся'
  } ${timeProcess()})`;
  const visitTextEnd = dateEnd && `Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`;

  const orderText = `Заявка (${order ? `${order.lines.length}` : '0'})`;
  const handleOrder = () => {
    return order ? navigation.navigate('OrderView', { id: order.id }) : handleNewOrder();
  };

  const returnText = 'Возврат (0)';
  const handleReturn = () => {
    // return return ? navigation.navigate('ReturnView', { id: return.id }) : handleNewReturn();
  };

  return (
    <>
      <InfoBlock colorLabel="#4E9600" title="Визит">
        <>
          <Text>{visitTextBegin}</Text>
          {dateEnd ? (
            <Text>{visitTextEnd}</Text>
          ) : (
            <View style={styles.flexGrow}>
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
