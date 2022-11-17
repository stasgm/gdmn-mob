import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import DeviceLogsView from './DeviceLogsView';
import DevicelogsList from './DeviceLogsList';

const routes: RouteObject[] = [
  { path: '/', element: <DevicelogsList /> },
  { path: '/:id', element: <DeviceLogsView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function DeviceLogs() {
  return useRoutes(routes);
}
