import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import CompanyDetails from '../../components/company/CompanyDetails';

import CompanyList from './CompanyList';

const routes: PartialRouteObject[] = [
  { path: '/', element: <CompanyList /> },
  { path: '/new', element: <CompanyDetails /> },
  { path: '/edit/:id', element: <CompanyDetails /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  return useRoutes(routes);
}
