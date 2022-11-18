import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import DeviceLogView from './DeviceLogView';
import DeviceLogFilesList from './DeviceLogFilesList';

const routes: RouteObject[] = [
  { path: '/', element: <DeviceLogFilesList /> },
  { path: '/:id', element: <DeviceLogView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function DeviceLogs() {
  return useRoutes(routes);
}
