import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

function useCameraPermission(): boolean | null {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return hasPermission;
}

export default useCameraPermission;
