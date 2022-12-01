import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import FileView from './FileView';
import FileList from './FileList';
import FileEdit from './FileEdit';

const routes: RouteObject[] = [
  { path: '/', element: <FileList /> },
  { path: '/:id', element: <FileView /> },
  { path: '/:id/edit', element: <FileEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Files() {
  return useRoutes(routes);
}
