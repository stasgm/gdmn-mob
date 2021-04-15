import { Navigate, useRoutes } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import ViewCompany from './ViewCompany';
import NewCompany from './NewCompany';
import CompanyList from './CompanyList';

const routes: PartialRouteObject[] = [
  { path: '/', element: <CompanyList /> },
  { path: '/new', element: <NewCompany /> },
  { path: '/edit/:id', element: <ViewCompany /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  return useRoutes(routes);
}
