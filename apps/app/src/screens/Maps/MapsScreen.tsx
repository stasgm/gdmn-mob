import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, LatLng, Polyline } from 'react-native-maps';

import * as Location from 'expo-location';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDispatch, useSelector } from '../../store';
import { geoActions } from '../../store/geo/actions';

import { mockGeo } from '../../store/geo/mock';

import localStyles from './styles';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const useGoogleMaps = true;

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

const MapScreen = () => {
  const dispatch = useDispatch();

  const [region, setRegion] = useState<Region>();
  const [loading, setLoading] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<number>(0);

  const { list } = useSelector((state) => state.geo);

  const refMap = useRef<MapView>(null);

  useEffect(() => {
    dispatch(geoActions.addMany(mockGeo));

    setRegion({
      latitude: 53.9,
      longitude: 27.56667,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    });
  }, [dispatch]);

  const handleGetLocation = async () => {
    const serviceEnabled = await Location.hasServicesEnabledAsync();

    if (!serviceEnabled) {
      /// Сервис у пользователя выключен
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return;
    }

    setLoading(true);

    dispatch(geoActions.deleteCurrent());
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    dispatch(geoActions.addCurrent({ coords: location.coords }));

    setLoading(false);
  };

  useEffect(() => {
    if (!loading && !list) {
      return;
    }

    const currentPos = list.find((e) => e.id === 'current');

    if (!currentPos) {
      return;
    }
    moveTo(currentPos.coords);
  }, [loading, list]);

  const moveToRegion = (coords: LatLng[]) => {
    refMap.current?.fitToCoordinates(coords, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  };

  const moveTo = (coords: LatLng) => {
    refMap.current?.animateCamera({ center: coords, zoom: 13 });
  };

  const handleFitToCoordinates = () => {
    moveToRegion(list.map((p) => p.coords));
  };

  const moveNextPoint = () => {
    const listLen = list.length;

    if (listLen === 0) {
      return;
    }

    const curIndex = currentPoint + 1 > listLen - 1 ? 0 : currentPoint + 1;
    moveTo(list[curIndex].coords);
    setCurrentPoint(curIndex);
  };

  const movePrevPoint = () => {
    const listLen = list.length;

    if (listLen === 0) {
      return;
    }

    const curIndex = currentPoint - 1 < 0 ? listLen - 1 : currentPoint - 1;
    moveTo(list[curIndex].coords);
    setCurrentPoint(curIndex);
  };

  return (
    <View style={localStyles.containerMap}>
      {loading && (
        <View style={localStyles.statusContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <MapView
        ref={refMap}
        initialRegion={region}
        style={localStyles.mapView}
        provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      >
        {list !== [] &&
          list.map((point) => (
            <Marker
              key={point.id}
              coordinate={point.coords}
              title={point.name}
              description={point.id}
              pinColor={point.id === 'current' ? 'blue' : 'red'}
            />
          ))}
        <Polyline coordinates={list.map((e) => e.coords)} />
      </MapView>
      <View style={[localStyles.buttonContainer]}>
        <TouchableOpacity onPress={movePrevPoint} style={[localStyles.bubble, localStyles.button]} disabled={loading}>
          <MaterialCommunityIcons name="chevron-left" size={35} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={moveNextPoint} style={[localStyles.bubble, localStyles.button]}>
          <MaterialCommunityIcons name="chevron-right" size={35} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFitToCoordinates} style={[localStyles.bubble, localStyles.button]}>
          <MaterialCommunityIcons name="routes" size={35} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGetLocation}
          disabled={loading}
          style={[localStyles.bubble, localStyles.button]}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={35} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapScreen;
