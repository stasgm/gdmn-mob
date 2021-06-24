import { Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as IntentLauncher from 'expo-intent-launcher';

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
    console.error(error);
    throw new Error(error);
  }
};

/* const getPermissionLocation = async () => {
  return await Location.requestForegroundPermissionsAsync();
}; */

const getLocationAndroid = async (status: Location.PermissionStatus) => {
  try {
    if (status === 'denied' || status === 'undetermined') {
      return LocationStatus.permissionsDenied;
    }

    return (await Location.hasServicesEnabledAsync())
      ? LocationStatus.permissionsAllowed
      : LocationStatus.permissionsAllowedWithGPSOff;
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};

export const getCurrentPosition = async (): Promise<ICoords> => {
  try {
    await getPermissionLocationStatus();

    let result = await Location.getLastKnownPositionAsync();
    result = result ? result : await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });

    return { latitude: result.coords.latitude, longitude: result.coords.longitude };
  } catch (error) {
    if (error.message.includes('Location services are disabled')) {
      throw new Error('Служба геолокации отключена');
    }
    if (error.message.includes('permission is required')) {
      throw new Error('Нет прав на получение геолокации');
    }
    console.log(error.message);
    throw new Error(error);
  }
};

export const getAddressFromLatAndLong = async ({ latitude, longitude }: ICoords) => {
  try {
    return await Location.reverseGeocodeAsync({ latitude, longitude });
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatitudeAndLongitudeFromString = async (string: string) => {
  try {
    return await Location.geocodeAsync(string);
  } catch (error) {
    throw new Error(error);
  }
};

export const openGPSAndroid = async () => {
  try {
    await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);

    if (await Location.hasServicesEnabledAsync()) {
      return LocationStatus.permissionsAllowed;
    }

    return LocationStatus.permissionsAllowedWithGPSOff;
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
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
