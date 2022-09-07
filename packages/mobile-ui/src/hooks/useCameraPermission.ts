import { useEffect } from 'react';
import { Camera, PermissionResponse } from 'expo-camera';

function useCameraPermission(): PermissionResponse | null {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  return permission;
}

export default useCameraPermission;
