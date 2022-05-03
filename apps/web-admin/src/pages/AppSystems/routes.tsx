import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import AppSystemView from './AppSystemView';
import AppSystemList from './AppSystemList';
import AppSystemCreate from './AppSystemCreate';
import AppSystemEdit from './AppSystemEdit';

const routes: RouteObject[] = [
  { path: '/', element: <AppSystemList /> },
  { path: '/new', element: <AppSystemCreate /> },
  { path: '/:id', element: <AppSystemView /> },
  { path: '/:id/edit', element: <AppSystemEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function AppSystems() {
  return useRoutes(routes);
}
