import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SnackBar from '../../components/SnackBar';

import { useDispatch, useSelector } from '../../store';

import { appSystemActions } from '../../store/appSystem/actions';

import AppSystemView from './AppSystemView';
import AppSystemList from './AppSystemList';
import AppSystemCreate from './AppSystemCreate';
import AppSystemEdit from './AppSystemEdit';

const routes: RouteObject[] = [
  { path: '/', element: <AppSystemList /> },
  { path: '/new', element: <AppSystemCreate /> },
  { path: '/:id', element: <AppSystemView /> },
  { path: '/:id/edit', element: <AppSystemEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function AppSystems() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const appSystemErrorMessage = useSelector((state) => state.appSystems.errorMessage);

  const handleClearError = () => {
    dispatch(appSystemActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!appSystemErrorMessage}
        errorMessage={appSystemErrorMessage}
        onClearError={handleClearError}
      />
    </>
  );
}
