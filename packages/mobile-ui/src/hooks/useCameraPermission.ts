import { useEffect } from 'react';
import { PermissionResponse, useCameraPermissions } from 'expo-camera';

function useCameraPermission(): PermissionResponse | null {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission;
}

export default useCameraPermission;
