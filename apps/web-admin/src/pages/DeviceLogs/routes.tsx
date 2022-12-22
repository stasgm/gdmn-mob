import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SnackBar from '../../components/SnackBar';
import { useDispatch, useSelector } from '../../store';
import { deviceLogActions } from '../../store/deviceLog/actions';

import DeviceLogFilesList from './DeviceLogFilesList';
import DeviceLogView from './DeviceLogView';

const routes: RouteObject[] = [
  { path: '/', element: <DeviceLogFilesList /> },
  { path: '/:id', element: <DeviceLogView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function DeviceLogs() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const logErrorMessage = useSelector((state) => state.deviceLogs.errorMessage);

  const handleClearError = () => {
    dispatch(deviceLogActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!logErrorMessage}
        errorMessage={logErrorMessage}
        onClearError={handleClearError}
      />
    </>
  );
}
