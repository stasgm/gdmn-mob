import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, LatLng, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { globalStyles as styles, Theme, BottomSheet, RadioGroup, PrimeButton } from '@lib/mobile-ui';
import { docSelectors, refSelectors } from '@lib/store';

import { useDispatch, useSelector } from '../../store';
import { geoActions } from '../../store/geo/actions';
import { ILocation } from '../../store/geo/types';
import { IOutlet, IRouteDocument } from '../../store/types';

import { getCurrentPosition } from '../../utils/expoFunctions';

import localStyles from './styles';
import { IListItem } from '@lib/mobile-types';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const useGoogleMaps = true;

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const DEFAULT_LATITUDE = 53.9;
const DEFAULT_LONGITUDE = 27.56667;

const MapScreen = () => {
  const [barVisible, setBarVisible] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const [region, setRegion] = useState<Region>();
  const [loading, setLoading] = useState(false);

  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const routeList = docSelectors
    .selectByDocType<IRouteDocument>('route')
    ?.sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const currentList: IListItem[] = routeList.map((item) => ({
    id: item.id,
    value: item.documentDate,
  }));

  //const [selectedOption, setSelectedOption] = useState<{ id: string; value: string } | null>(null);

  const [selectedRoute, setSelectedRoute] = useState(currentList[0]);
  const routeRef = useRef<BottomSheetModal>(null);

  const handlePresentRoute = useCallback(() => {
    routeRef.current?.present();
  }, [routeRef]);

  const selectedList = routeList.find((item) => item.id === selectedRoute.id);
  const initLocations = useCallback(() => {
    if (!!routeList && !!outlets) {
      const initialList: ILocation[] = selectedList!.lines.map((e) => {
        const outlet = outlets.find((i) => i.id === e.outlet.id);
        const res: ILocation = {
          number: e.ordNumber,
          id: `${e.id}${e.outlet.id}`,
          name: e.outlet.name,
          coords: { latitude: outlet?.lat || DEFAULT_LATITUDE, longitude: outlet?.lon || DEFAULT_LONGITUDE },
        };
        return res;
      });

      dispatch(geoActions.addMany(initialList));
    }
  }, [dispatch, outlets, routeList, selectedList]);

  const list = (useSelector((state) => state.geo)?.list || [])?.sort((a, b) => a.number - b.number);
  const currentPoint = useSelector((state) => state.geo?.currentPoint);

  const setCurrentPoint = useCallback(
    (point: ILocation) => {
      dispatch(geoActions.setCurrentPoint(point));
    },
    [dispatch],
  );

  const refMap = useRef<MapView>(null);

  useEffect(() => {
    initLocations();

    setRegion({
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetLocation = async () => {
    setLoading(true);

    dispatch(geoActions.deleteCurrent());

    try {
      const coords = await getCurrentPosition();
      coords && dispatch(geoActions.addCurrent({ coords }));
    } catch (e) {
      if (e instanceof TypeError) {
        setMessage(e.message);
      } else {
        setMessage('Неизвестная ошибка');
      }
      setBarVisible(true);
    }

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

    setCurrentPoint(currentPos);
    moveTo(currentPos.coords);
  }, [loading, list, setCurrentPoint]);

  const moveToRegion = (coords: LatLng[]) => {
    refMap.current?.fitToCoordinates(coords, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  };

  useEffect(() => {
    if (!currentPoint) {
      return;
    }

    moveTo(currentPoint.coords);
  }, [currentPoint]);

  const moveTo = (coords: LatLng) => {
    refMap.current?.animateCamera({ center: coords, zoom: 13 });
  };

  const handleFitToCoordinates = () => {
    if (!list.length) {
      return;
    }
    moveToRegion(list.map((p) => p.coords));
  };

  const moveNextPoint = () => {
    const listLen = list.length;

    if (!listLen) {
      return;
    }

    let idx = list.findIndex((e) => e.id === currentPoint?.id);
    idx = idx >= 0 ? idx : -1;
    idx = idx >= listLen - 1 ? 0 : idx + 1;

    setCurrentPoint(list[idx]);
  };

  const movePrevPoint = () => {
    const listLen = list.length;

    if (!listLen) {
      return;
    }

    let idx = list.findIndex((e) => e.id === currentPoint?.id);

    idx = idx >= 0 ? idx : 0;
    idx = idx <= 0 ? listLen - 1 : idx - 1;

    setCurrentPoint(list[idx]);
  };

  const handleClickMarker = (props: ILocation) => {
    setCurrentPoint(props);
  };

  const handleDismissRoute = () => routeRef.current?.dismiss();

  const handleApplyRoute = () => {
    routeRef.current?.dismiss();
    return initLocations();
  };

  return (
    <View style={localStyles.containerMap}>
      {loading && (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <MapView
        ref={refMap}
        initialRegion={region}
        style={localStyles.mapView}
        provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      >
        {list.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coords}
            title={point.name}
            description={point.id}
            pinColor={point.id === 'current' ? 'blue' : 'red'}
            onPress={() => handleClickMarker(point)}
          >
            <View
              style={[
                styles.icon,
                point.number === 0
                  ? localStyles.myLocationMark
                  : point.id === currentPoint?.id
                  ? localStyles.selectedMark
                  : localStyles.mark,
              ]}
            >
              <Text style={styles.lightText}>{point.number}</Text>
            </View>
          </Marker>
        ))}
        <Polyline coordinates={list.map((e) => e.coords)} />
      </MapView>
      {currentPoint ? (
        <View style={localStyles.statusContainer}>
          <Text style={localStyles.pointName}>{currentPoint?.name}</Text>
        </View>
      ) : null}
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
      <View /* style={[localStyles.button]}*/>
        <TouchableOpacity disabled={loading}>
          <PrimeButton onPress={handlePresentRoute}>Cменить маршрут </PrimeButton>
        </TouchableOpacity>
      </View>

      <BottomSheet
        sheetRef={routeRef}
        title={'Маршруты'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissRoute}
        onApply={handleApplyRoute}
      >
        <RadioGroup
          options={currentList}
          onChange={(option) => setSelectedRoute(option)}
          activeButtonId={selectedList?.id}
        />
      </BottomSheet>

      <Snackbar
        visible={barVisible}
        onDismiss={() => setBarVisible(false)}
        style={{ backgroundColor: Theme.colors.error }}
        action={{
          icon: 'close',
          label: '',
          onPress: () => {
            setBarVisible(false);
          },
        }}
      >
        {message}
      </Snackbar>
    </View>
  );
};

export default MapScreen;
