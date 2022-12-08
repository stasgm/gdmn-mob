import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import { processActions } from '../../store/process/actions';

import SnackBar from '../../components/SnackBar';

import ProcessView from './ProcessView';
import ProcessList from './ProcessList';

const routes: RouteObject[] = [
  { path: '/', element: <ProcessList /> },
  { path: '/:id', element: <ProcessView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Processes() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const processErrorMessage = useSelector((state) => state.processes.errorMessage);
  const errorMessage = useSelector((state) => state.auth.errorMessage);

  const handleClearError = () => {
    dispatch(processActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!processErrorMessage && !errorMessage}
        errorMessage={`Ошибка: ${processErrorMessage}`}
        onClearError={handleClearError}
      />
    </>
  );
}
