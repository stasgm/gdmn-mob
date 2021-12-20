import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import UserDeviceView from './UserDeviceView';

import UserDeviceEdit from './UserDeviceEdit';

import UserView from './UserView';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import UserList from './UserList';
import UserDeviceCreate from './UserDeviceCreate';

const routes: RouteObject[] = [
  { path: '/', element: <UserList /> },
  { path: '/new', element: <UserCreate /> },
  { path: '/:id', element: <UserView /> },
  { path: '/:id/binding/new', element: <UserDeviceCreate /> },
  { path: '/:id/binding/:bindingid', element: <UserDeviceView /> },
  { path: '/:id/binding/:bindingid/edit', element: <UserDeviceEdit /> },
  { path: '/:id/edit', element: <UserEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Users() {
  return useRoutes(routes);
}
