import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

// import ProcessView from './ProcessView';
import ProcessList from './ProcessList';

const routes: RouteObject[] = [
  { path: '/', element: <ProcessList /> },
  // { path: '/:id', element: <ProcessView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  return useRoutes(routes);
}
