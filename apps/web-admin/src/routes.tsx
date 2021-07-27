import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Companies from './pages/Companies';
// import CompanyList from './pages/Companies/CompanyList';
import Devices from './pages/Devices';
import Register from './pages/Register';
import Login from './pages/Login';
// import CompanyDetails from './components/company/CompanyDetails';

import { adminPath } from './utils/constants';

const routes = (isLoggedIn: boolean): PartialRouteObject[] => [
  {
    path: 'admin/app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to={`${adminPath}/login`} />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'companies/*', element: <Companies /> },
      { path: 'users/*', element: <Users /> },
      { path: 'devices/*', element: <Devices /> },
      { path: '/', element: <Navigate to={`${adminPath}/app/dashboard`} /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to={`${adminPath}/app/dashboard`} />,
    children: [
      { path: '/admin/login', element: <Login /> },
      { path: '/admin/register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to={`${adminPath}/login`} /> },
      { path: '/admin', element: <Navigate to={`${adminPath}/login`} /> },
    ],
  },
  { path: '*', element: <Navigate to="/404" /> },
];

export default routes;
