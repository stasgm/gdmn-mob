import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { FAB, useTheme } from 'react-native-paper';

import { useDispatch, useSelector } from '../../store';
import { globalStyles as styles } from '@lib/mobile-ui';
import { geoActions } from '../../store/geo/actions';

import localStyles from './styles';
import { mockGeo } from '../../store/geo/mock';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapScreen = () => {
  const [region, setRegion] = useState<Region>();
  const [loading, setLoading] = useState(false);

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

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return;
    }

    setLoading(true);
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });

    dispatch(geoActions.addOne({ name: 'Моё местоположение', coords: location.coords }));

    setLoading(false);
  };

  return (
    <View style={localStyles.containerMap}>
      <MapView initialRegion={region} style={localStyles.mapView}>
        {list !== [] &&
          list.map((point) => (
            <Marker key={point.id} coordinate={point.coords} title={`${point.name}`} description={point.id} />
          ))}
      </MapView>
      <View style={[styles.directionRow]}>
        <FAB
          onPress={handleGetLocation}
          icon="navigation"
          disabled={loading}
          style={[styles.fabAdd, { backgroundColor: colors.primary }]}
        />
        <FAB
          onPress={() => {
            dispatch(geoActions.addMany(mockGeo));
          }}
          icon="backup-restore"
          style={[styles.fabAdd, { backgroundColor: colors.primary }]}
        />
      </View>
    </View>
  );
};

export default MapScreen;
