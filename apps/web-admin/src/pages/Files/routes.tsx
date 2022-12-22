import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import { fileSystemActions } from '../../store/file/actions';

import SnackBar from '../../components/SnackBar';

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
