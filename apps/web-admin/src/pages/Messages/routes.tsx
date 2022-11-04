import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import MessageView from './MessageView';
import MessageList from './MessageList';

const routes: RouteObject[] = [
  { path: '/', element: <MessageList /> },
  { path: '/:id', element: <MessageView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Messages() {
  return useRoutes(routes);
}
