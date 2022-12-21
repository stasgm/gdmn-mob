import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import { userActions } from '../../store/user/actions';

import SnackBar from '../../components/SnackBar';

import UserDeviceView from './UserDeviceView';

import UserDeviceEdit from './UserDeviceEdit';

import UserView from './UserView';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import UserList from './UserList';
import UserDeviceCreate from './UserDeviceCreate';

const routes: RouteObject[] = [
  { path: '/', element: <UserList /> },
  { path: '/new', element: <UserCreate /> },
  { path: '/:id', element: <UserView /> },
  { path: '/:id/binding/new', element: <UserDeviceCreate /> },
  { path: '/:id/binding/:bindingid', element: <UserDeviceView /> },
  { path: '/:id/binding/:bindingid/edit', element: <UserDeviceEdit /> },
  { path: '/:id/edit', element: <UserEdit /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Users() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const usersErrorMessage = useSelector((state) => state.users.errorMessage);

  const handleClearError = () => {
    dispatch(userActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!usersErrorMessage}
        errorMessage={usersErrorMessage}
        onClearError={handleClearError}
      />
    </>
  );
}
