import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
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
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const handleGetLocation = useCallback(() => {
    setRegion({
      latitude: -12.960978,
      longitude: 27.4970895,
      latitudeDelta: 0.0027,
      longitudeDelta: 0.0015,
    });
  }, []);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Текущая локация',
        onPress: handleGetLocation,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleGetLocation, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

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
      <MapView initialRegion={region} style={styles.mapView} region={region} />
    </View>
  );
};

export default MapScreen;
