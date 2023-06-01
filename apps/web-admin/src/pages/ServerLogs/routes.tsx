import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import { fileSystemActions } from '../../store/file/actions';

import SnackBar from '../../components/SnackBar';

import ServerLogView from './ServerLogView';
import ServerLogList from './ServerLogList';

const routes: RouteObject[] = [
  { path: '/', element: <ServerLogList /> },
  { path: '/:id', element: <ServerLogView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function ServerLogs() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const filesErrorMessage = useSelector((state) => state.files.errorMessage);

  const handleClearError = () => {
    dispatch(fileSystemActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar visible={!!filesErrorMessage} errorMessage={filesErrorMessage} onClearError={handleClearError} />
    </>
  );
}
