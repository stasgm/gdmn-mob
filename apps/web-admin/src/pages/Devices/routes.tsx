import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import DeviceView from './DeviceView';
import DeviceEdit from './DeviceEdit';
import DeviceCreate from './DeviceCreate';
import DeviceList from './DeviceList';

const routes: PartialRouteObject[] = [
  { path: '/', element: <DeviceList /> },
  { path: '/new', element: <DeviceCreate /> },
  { path: '/:id', element: <DeviceView /> },
  { path: '/:id/edit', element: <DeviceEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Devices() {
  return useRoutes(routes);
}
