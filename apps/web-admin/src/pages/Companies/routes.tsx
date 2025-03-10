import { Navigate, useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import { useDispatch, useSelector } from '../../store';

import SnackBar from '../../components/SnackBar';

import { companyActions } from '../../store/company/actions';

import ErpLogView from '../../components/erpLog/ErpLogView';

import CompanyView from './CompanyView';
import CompanyEdit from './CompanyEdit';
import CompanyCreate from './CompanyCreate';
import CompanyList from './CompanyList';
import CompanyAppSystemEdit from './CompanyAppSystemEdit';
import CompanyAppSystemCreate from './CompanyAppSystemCreate';
import CompanyAppSystemView from './CompanyAppSystemView';

const routes: RouteObject[] = [
  { path: '/', element: <CompanyList /> },
  { path: '/new', element: <CompanyCreate /> },
  { path: '/:id', element: <CompanyView /> },
  { path: '/:id/edit', element: <CompanyEdit /> },
  { path: '/:id/appSystems/new', element: <CompanyAppSystemCreate /> },
  { path: '/:id/appSystems/:appSystemId', element: <CompanyAppSystemView /> },
  { path: '/:id/appSystems/:appSystemId/edit', element: <CompanyAppSystemEdit /> },
  { path: '/:id/appSystems/:appSystemId/erpLog', element: <ErpLogView /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default function Companies() {
  const routeComponent = useRoutes(routes);
  const dispatch = useDispatch();
  const companiesErrorMessage = useSelector((state) => state.companies.errorMessage);

  const handleClearError = () => {
    dispatch(companyActions.clearError());
  };

  return (
    <>
      {routeComponent}
      <SnackBar
        visible={!!companiesErrorMessage}
        errorMessage={companiesErrorMessage}
        onClearError={handleClearError}
      />
    </>
  );
}
