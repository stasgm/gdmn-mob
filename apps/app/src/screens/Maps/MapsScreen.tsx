import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { useDispatch, useSelector } from '../../store';

import { geoActions } from '../../store/geo/actions';

import styles from './styles';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapScreen = () => {
  const [region, setRegion] = useState<Region>();
  const { list } = useSelector((state) => state.geo);

  const dispatch = useDispatch();

  useEffect(() => {
    setRegion({
      latitude: 53.9,
      longitude: 27.56667,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button
        onPress={async () => {
          const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
          dispatch(geoActions.addOne({ name: 'Моё местоположение', coords: location.coords }));
          /*setRegion({
            ...location.coords,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });*/
        }}
        title={'Добавить моё местоположение'}
      />
      <MapView initialRegion={region} style={styles.mapView}>
        {list !== [] &&
          list.map((point) => (
            <Marker key={point.id} coordinate={point.coords} title={`${point.name}`} description={point.id} />
          ))}
      </MapView>
      <Button
        onPress={() => {
          dispatch(geoActions.init());
        }}
        title={'Сбросить'}
      />
    </View>
  );
};

export default MapScreen;
