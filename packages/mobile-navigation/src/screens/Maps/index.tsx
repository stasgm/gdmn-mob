import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import MapView from 'react-native-maps';

import styles from './styles';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapScreen = () => {
  const [region, setRegion] = useState<Region>();

  useEffect(() => {
    setRegion({
      latitude: -12.960978,
      longitude: -38.4812882,
      latitudeDelta: 0.0051,
      longitudeDelta: 0.03104,
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView initialRegion={region} style={styles.mapView} />
    </View>
  );
};

export default MapScreen;
