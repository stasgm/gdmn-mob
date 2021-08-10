import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import UserDeviceView from './UserDeviceView';

import UserDeviceEdit from './UserDeviceEdit';

import UserView from './UserView';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import UserList from './UserList';
import UserDeviceCreate from './UserDeviceCreate';

const routes: PartialRouteObject[] = [
  { path: '/', element: <UserList /> },
  { path: '/new', element: <UserCreate /> },
  { path: '/:id', element: <UserView /> },
  { path: '/:id/binding/new', element: <UserDeviceCreate /> },
  { path: '/:id/binding/:bindingid', element: <UserDeviceView /> },
  { path: '/:id/binding/edit/:bindingid', element: <UserDeviceEdit /> },
  { path: '/edit/:id', element: <UserEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Users() {
  return useRoutes(routes);
}
