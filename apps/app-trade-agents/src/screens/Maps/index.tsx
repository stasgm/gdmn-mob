import { DrawerButton, MenuButton } from '@lib/mobile-ui/src/components/AppBar';
import { useActionSheet } from '@lib/mobile-ui/src/hooks';
// import { useDispatch } from '@lib/store';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
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

  const handleLoad = useCallback(() => {
    // dispatch(documentActions.addDocuments(routeMock));
  }, []);

  const handleDelete = useCallback(() => {
    // dispatch(documentActions.deleteAllDocuments());
  }, []);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Загрузить',
        onPress: handleLoad,
      },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleLoad, handleDelete]);

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
      <MapView initialRegion={region} style={styles.mapView} />
    </View>
  );
};

export default MapScreen;
