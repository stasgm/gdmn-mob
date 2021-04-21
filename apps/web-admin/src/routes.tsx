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
import DeviceList from './pages/DeviceList';
import Register from './pages/Register';
import Login from './pages/Login';
// import CompanyDetails from './components/company/CompanyDetails';

const routes = (isLoggedIn: boolean): PartialRouteObject[] => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'companies/*', element: <Companies /> },
      { path: 'users/*', element: <Users /> },
      { path: 'devices', element: <DeviceList /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/login" /> },
    ],
  },
  { path: '*', element: <Navigate to="/404" /> },
];

export default routes;
