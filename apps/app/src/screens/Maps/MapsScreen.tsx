import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { FAB } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

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
  const { colors } = useTheme();

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
    <View style={styles.containerMap}>
      <MapView initialRegion={region} style={styles.mapView}>
        {list !== [] &&
          list.map((point) => (
            <Marker key={point.id} coordinate={point.coords} title={`${point.name}`} description={point.id} />
          ))}
      </MapView>
      <View style={[styles.directionRow]}>
        <FAB
          onPress={async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              return;
            }

            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
            dispatch(geoActions.addOne({ name: 'Моё местоположение', coords: location.coords }));
            /*setRegion({
              ...location.coords,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });*/
          }}
          icon="navigation"
          style={[styles.fabAdd, { backgroundColor: colors.primary }]}
        />
        <FAB
          onPress={() => {
            dispatch(geoActions.init());
          }}
          icon="backup-restore"
          style={[styles.fabAdd, { backgroundColor: colors.primary }]}
        />
      </View>
    </View>
  );
};

export default MapScreen;
