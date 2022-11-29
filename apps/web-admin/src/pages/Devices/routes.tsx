import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import SnackBar from '../../components/SnackBar';

import { deviceActions } from '../../store/device/actions';

import DeviceView from './DeviceView';
import DeviceEdit from './DeviceEdit';
import DeviceCreate from './DeviceCreate';
import DeviceList from './DeviceList';

const routes: RouteObject[] = [
  { path: '/', element: <DeviceList /> },
  { path: '/new', element: <DeviceCreate /> },
  { path: '/:id', element: <DeviceView /> },
  { path: '/:id/edit', element: <DeviceEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Devices() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const devicesErrorMessage = useSelector((state) => state.devices.errorMessage);
  const errorMessage = useSelector((state) => state.auth.errorMessage);

  const handleClearError = () => {
    dispatch(deviceActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!devicesErrorMessage && !errorMessage}
        errorMessage={`Ошибка: ${devicesErrorMessage}`}
        onClearError={handleClearError}
      />
    </>
  );
}
