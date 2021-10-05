import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useGeoLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Нет прав для получения геолокации');
            console.error('Permission to access location was denied');
            return;
          }
          const lastKnownLocation = await Location.getLastKnownPositionAsync();
          if (lastKnownLocation) {
            setLocation(lastKnownLocation);
            setIsLoading(false);
          } else {
            const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
            setLocation(currentLocation);
            setIsLoading(false);
          }
        } catch (error) {
          if (error instanceof TypeError) {
            setErrorMsg(error.message);
          } else {
            throw new Error('Неизвестная ошибка');
          }
        }
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { location, errorMsg, isLoading };
};

export default useGeoLocation;
