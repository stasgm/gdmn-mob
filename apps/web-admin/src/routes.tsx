import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import UserList from './pages/UserList';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import CompanyList from './pages/CompanyList';
import DeviceList from './pages/DeviceList';
import Register from './pages/Register';
import Login from './pages/Login';

const isLoggin = true;

const Home = isLoggin ? <DashboardLayout /> : <Navigate to="/login" />;

const routes: PartialRouteObject[] = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'users', element: <UserList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'companies', element: <CompanyList /> },
      { path: 'devices', element: <DeviceList /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: Home },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
