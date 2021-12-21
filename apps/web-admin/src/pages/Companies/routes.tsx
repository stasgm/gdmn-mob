import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import CompanyView from './CompanyView';
import CompanyEdit from './CompanyEdit';
import CompanyCreate from './CompanyCreate';
import CompanyList from './CompanyList';

const routes: RouteObject[] = [
  { path: '/', element: <CompanyList /> },
  { path: '/new', element: <CompanyCreate /> },
  { path: '/:id', element: <CompanyView /> },
  { path: '/:id/edit', element: <CompanyEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  return useRoutes(routes);
}
