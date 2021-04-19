import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import CompanyView from './CompanyView';
import CompanyEdit from './CompanyEdit';
import CompanyCreate from './CompanyCreate';
import CompanyList from './CompanyList';

const routes: PartialRouteObject[] = [
  { path: '/', element: <CompanyList /> },
  { path: '/new', element: <CompanyCreate /> },
  { path: '/:id', element: <CompanyView /> },
  { path: '/edit/:id', element: <CompanyEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  return useRoutes(routes);
}
