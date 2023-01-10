import { Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

import { sleep } from '@lib/mobile-hooks';

import { ICoords } from '../store/geo/types';

const LocationStatus = {
  permissionsAllowed: 'permissionsAllowed',
  permissionsDenied: 'permissionsDenied',
  permissionsAllowedWithGPSOff: 'permissionsAllowedWithGPSOff',
};

export const getPermissionLocationStatus = async () => {
  try {
    const { status } = await getPermissionLocation();

    const locStatus = await (Platform.OS === 'ios' ? getLocationIos(status) : getLocationAndroid(status));

    // if (locStatus !== LocationStatus.permissionsDenied) {
    return locStatus;
    // }

    // return new Error('Нет прав на получение геолокации');
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

const getLocationAndroid = async (status: Location.PermissionStatus) => {
  try {
    if (status === 'denied' || status === 'undetermined') {
      return LocationStatus.permissionsDenied;
    }

    return (await Location.hasServicesEnabledAsync())
      ? LocationStatus.permissionsAllowed
      : LocationStatus.permissionsAllowedWithGPSOff;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

const getLocationIos = async (status: Location.PermissionStatus) => {
  try {
    if (status === 'denied') {
      return (await Location.hasServicesEnabledAsync())
        ? LocationStatus.permissionsDenied
        : LocationStatus.permissionsAllowedWithGPSOff;
    } else if (status === 'undetermined') {
      // await askPermissionLocation();
      return LocationStatus.permissionsDenied;
    }

    return LocationStatus.permissionsAllowed;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getCurrentPosition = async (): Promise<ICoords | undefined> => {
  try {
    await getPermissionLocationStatus();

    const lastKnownPos = await Location.getLastKnownPositionAsync();

    const result = lastKnownPos
      ? lastKnownPos
      : await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }), sleep(15000)]);

    return result ? { latitude: result.coords.latitude, longitude: result.coords.longitude } : undefined;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Location services are disabled')) {
        throw new Error('Служба геолокации отключена');
      }
      if (error.message.includes('permission is required')) {
        throw new Error('Нет прав на получение геолокации');
      }
    } else {
      throw new Error('Неизвестная ошибка');
    }
    return;
  }
};

export const getAddressFromLatAndLong = async ({ latitude, longitude }: ICoords) => {
  try {
    return await Location.reverseGeocodeAsync({ latitude, longitude });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getLatitudeAndLongitudeFromString = async (string: string) => {
  try {
    return await Location.geocodeAsync(string);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const openGPSAndroid = async () => {
  try {
    await startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);

    if (await Location.hasServicesEnabledAsync()) {
      return LocationStatus.permissionsAllowed;
    }

    return LocationStatus.permissionsAllowedWithGPSOff;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const openSettingIos = () => {
  Linking.openURL('app-settings:');
};

const getPermissionLocation = async () => {
  try {
    return await Location.requestForegroundPermissionsAsync();
    // return await Permissions.getAsync(Permissions.LOCATION_FOREGROUND);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

/* export const askPermissionLocation = async () => {
  try {
    // return await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
  } catch (error) {
    throw new Error(error);
  }
};
 */
