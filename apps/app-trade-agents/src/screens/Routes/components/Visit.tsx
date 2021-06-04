import React, { useState } from 'react';
//import { useNavigation } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import * as Location from 'expo-location';

import { globalStyles } from '@lib/mobile-ui';

import { useDispatch } from '../../../store';

import { IVisit, ICoords } from '../../../store/visits/types';
import { visitActions } from '../../../store/visits/actions';

//import { StackNavigationProp } from '@react-navigation/stack';

const Visit = ({ item }: { item: IVisit }) => {
  const dateBegin = new Date(item.dateBegin);
  const dateEnd = item.dateEnd ? new Date(item.dateEnd) : undefined;
  const [process, setProcess] = useState(false);

  const dispatch = useDispatch();

  const timeProcess = () => {
    const diffMinutes = Math.floor(
      ((item.dateEnd ? Date.parse(item.dateEnd) : Date.now()) - Date.parse(item.dateBegin)) / 60000,
    );
    const hour = Math.floor(diffMinutes / 60);
    return `${hour} часов ${diffMinutes - hour * 60} минут`;
  };

  const handleCloseVisit = async () => {
    setProcess(true);

    /*const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setProcess(false);
      return;
    }

    const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });*/
    const date = new Date().toISOString();

    dispatch(
      visitActions.edit({
        id: item.id,
        dateEnd: date,
        endGeoPoint: { latitude: 53.89076, longitude: 27.551006 } as ICoords,
        //endGeoPoint: coords as unknown as ICoords,
      }),
    );

    setProcess(false);
  };

  const twoDigits = (value: number) => {
    return value >= 10 ? value : `0${value}`;
  };

  return (
    <View>
      <Text>{`Визит начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
        !dateEnd ? 'тся' : 'лся'
      } ${timeProcess()})`}</Text>
      {process ? (
        <ActivityIndicator size="large" color="#3914AF" />
      ) : (
        <>
          {dateEnd ? (
            <Text>{`Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`}</Text>
          ) : (
            <>
              <Button
                mode="outlined"
                style={[globalStyles.rectangularButton, localStyles.buttons]}
                onPress={() => {
                  //TODO: ссылка на документ
                }}
              >
                Заявка
              </Button>
              <Button
                mode="outlined"
                style={[globalStyles.rectangularButton, localStyles.buttons]}
                onPress={() => {
                  //TODO: ссылка на документ
                }}
              >
                Возврат
              </Button>
              <Button
                onPress={handleCloseVisit}
                mode="contained"
                style={[globalStyles.rectangularButton, localStyles.buttons]}
              >
                Завершить визит
              </Button>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Visit;

const localStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
});
