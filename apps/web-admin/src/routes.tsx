import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Companies from './pages/Companies';
import Devices from './pages/Devices';
import Processes from './pages/Processes';
import AppSystems from './pages/AppSystems';
import DeviceLogs from './pages/DeviceLogs';
import Files from './pages/Files';
import ServerLogs from './pages/ServerLogs';
import Register from './pages/Register';
import Login from './pages/Login';

import { adminPath } from './utils/constants';
const routes = (isLoggedIn: boolean): RouteObject[] => [
  {
    path: 'admin/app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to={`${adminPath}/login`} />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'companies/*', element: <Companies /> },
      { path: 'users/*', element: <Users /> },
      { path: 'devices/*', element: <Devices /> },
      { path: 'processes/*', element: <Processes /> },
      { path: 'appSystems/*', element: <AppSystems /> },
      { path: 'deviceLogs/*', element: <DeviceLogs /> },
      { path: 'files/*', element: <Files /> },
      { path: 'serverLogs/*', element: <ServerLogs /> },
      { path: '', element: <Dashboard /> },
      { path: '*', element: <Navigate to={`${adminPath}/404`} /> },
    ],
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to={`${adminPath}/app/dashboard`} />,
    children: [
      { path: 'admin/login', element: <Login /> },
      { path: 'admin/register', element: <Register /> },
      { path: 'admin/404', element: <NotFound /> },
      { path: '', element: <Navigate to={`${adminPath}/login`} /> },
      { path: 'admin', element: <Navigate to={`${adminPath}/login`} /> },
      { path: '*', element: <Navigate to={`${adminPath}/404`} /> },
    ],
  },
  { path: '*', element: <Navigate to={`${adminPath}/404`} /> },
];

export default routes;
