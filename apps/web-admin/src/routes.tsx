import { Navigate, Routes, Route } from 'react-router-dom';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';

import { adminPath } from './utils/constants';
import {
  Account,
  AppSystems,
  Companies,
  Dashboard,
  DeviceLogs,
  Devices,
  Files,
  Login,
  NotFound,
  Processes,
  Register,
  ServerLogs,
  Users,
} from './pages';

const AppRoutes = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <Routes>
    <Route
      path={`${adminPath}/app/*`}
      element={isLoggedIn ? <DashboardLayout /> : <Navigate to={`${adminPath}/login`} />}
    >
      <Route path="account" element={<Account />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="companies/*" element={<Companies />} />
      <Route path="users/*" element={<Users />} />
      <Route path="devices/*" element={<Devices />} />
      <Route path="processes/*" element={<Processes />} />
      <Route path="appSystems/*" element={<AppSystems />} />
      <Route path="deviceLogs/*" element={<DeviceLogs />} />
      <Route path="files/*" element={<Files />} />
      <Route path="serverLogs/*" element={<ServerLogs />} />
      <Route path="" element={<Dashboard />} />
      <Route path="*" element={<Navigate to={`${adminPath}/404`} />} />
    </Route>
    <Route path="/" element={!isLoggedIn ? <MainLayout /> : <Navigate to={`${adminPath}/app/dashboard`} />}>
      <Route path={`${adminPath}/login`} element={<Login />} />
      <Route path={`${adminPath}/register`} element={<Register />} />
      <Route path={`${adminPath}/404`} element={<NotFound />} />
      <Route path="" element={<Navigate to={`${adminPath}/login`} />} />
      <Route path={adminPath} element={<Navigate to={`${adminPath}/login`} />} />
      <Route path="*" element={<Navigate to={`${adminPath}/404`} />} />
    </Route>
    <Route path="*" element={<Navigate to={`${adminPath}/404`} />} />
  </Routes>
);

export default AppRoutes;
