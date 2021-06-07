import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { globalStyles as styles, BackButton, InfoBlock, PrimeButton } from '@lib/mobile-ui';
import { IDocument, IEntity, INamedEntity, IUserDocument } from '@lib/types';

import { docSelectors, documentActions } from '@lib/store';

import { useDispatch } from '../../../store';

import { IVisit } from '../../../store/visits/types';
import { visitActions } from '../../../store/visits/actions';
import { IOrderDocument } from '../../../store/docs/types';
import { ICoords } from '../../../store/geo/types';

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
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [process, setProcess] = useState(false);

  const dateBegin = new Date(item.dateBegin);
  const dateEnd = item.dateEnd ? new Date(item.dateEnd) : undefined;

  const order = ((docSelectors.selectByDocType('order') as unknown) as IOrderDocument[])?.find(
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

    const coords = ((await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    })) as unknown) as ICoords;

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

    dispatch(documentActions.addDocument((newOrder as unknown) as IUserDocument<IDocument, IEntity[]>));

    navigation.navigate('Orders', {
      screen: 'OrderView',
      params: { id: newOrder.id },
      // initial: false,
    });
  };

  return (
    <View style={styles.container}>
      <InfoBlock colorLabel="#3914AF" title="Визит">
        <>
          <Text>{`Визит начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
            !dateEnd ? 'тся' : 'лся'
          } ${timeProcess()})`}</Text>
          {dateEnd && <Text>{`Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`}</Text>}
          {!dateEnd && (
            <View style={localStyles.buttons}>
              <PrimeButton
                outlined
                style={localStyles.button}
                onPress={() => {
                  order
                    ? navigation.navigate('Orders', {
                        screen: 'OrderView',
                        params: { id: order.id },
                        // initial: false,
                      })
                    : handleNewOrder();
                }}>
                {`Заявка (${order ? `${order.lines.length}` : '0'})`}
              </PrimeButton>
              <PrimeButton
                outlined
                style={localStyles.button}
                onPress={() => {
                  //TODO: ссылка на документ
                }}>
                Возврат (0)
              </PrimeButton>
            </View>
          )}
        </>
      </InfoBlock>
      {process ? (
        <ActivityIndicator size="large" color="#3914AF" />
      ) : (
        <>
          {!dateEnd && (
            <>
              <PrimeButton onPress={handleCloseVisit}>Завершить визит</PrimeButton>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Visit;

const localStyles = StyleSheet.create({
  /*buttons: {
    alignItems: 'center',
    margin: 10,
  },*/
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
  },
});
