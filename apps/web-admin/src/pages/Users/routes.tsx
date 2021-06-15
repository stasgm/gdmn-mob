import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import DeviceView from '../Devices/DeviceView';
import DeviceEdit from '../Devices/DeviceEdit';

import UserView from './UserView';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import UserList from './UserList';

const routes: PartialRouteObject[] = [
  { path: '/', element: <UserList /> },
  { path: '/new', element: <UserCreate /> },
  { path: '/:id', element: <UserView /> },
  { path: '/:id/selectdevice', element: <UserView isSelectDevice={true} /> },
  { path: '/:userid/devices/:id', element: <DeviceView sourcePath={'/app/users/:userid/'} /> },
  { path: '/:userid/selectdevice/devices/:id', element: <DeviceView sourcePath={'/app/users/:userid/selectdevice'} /> },
  {
    path: '/:userid/devices/edit/:id',
    element: <DeviceEdit sourcePath={'/app/users/:userid/devices/:id'} />,
  },
  {
    path: '/:userid/selectdevice/devices/edit/:id',
    element: <DeviceEdit sourcePath={'/app/users/:userid/selectdevice/devices/:id'} />,
  },
  { path: '/edit/:id', element: <UserEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Users() {
  return useRoutes(routes);
}
