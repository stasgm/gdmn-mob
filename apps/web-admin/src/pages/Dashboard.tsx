import { Box, Container, Typography, Grid, CardContent, Card, useTheme } from '@mui/material';

import { useCallback, useEffect, useMemo, useState } from 'react';

import WidgetsIcon from '@mui/icons-material/Widgets';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import { useDispatch, useSelector } from '../store';

import TotalCompanies from '../components/dashboard/Totalcompanies';
import TotalUsers from '../components/dashboard/Totalusers';
import TotalDevices from '../components/dashboard/Totaldevices';

import { companyActions } from '../store/company';
import { userActions } from '../store/user';
import { deviceActions } from '../store/device';
import CircularProgressWithContent from '../components/CircularProgressWidthContent';
import { appSystemActions } from '../store/appSystem';
import { IFileFilter, IHeadCells } from '../types';
import TotalAppSystems from '../components/dashboard/Totalappsystems';
import { fileActions } from '../store/file';
import UserDeviceTable from '../components/dashboard/UserDeviceTable';

interface ICompanyInfo {
  id: string;
  name: string;
  deviceQuantity: string;
  userQuantity: string;
  lastActivity: string;
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { list: devices, loading: deviceLoading } = useSelector((state) => state.devices);
  const { list: files, loading: filesLoading } = useSelector((state) => state.files);
  const { list: users, loading: userLoading } = useSelector((state) => state.users);
  const { list: companies, loading: companyLoading } = useSelector((state) => state.companies);
  const { list: appSystems, loading: appSystemLoading } = useSelector((state) => state.appSystems);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    const loadData = async () => {
      await dispatch(companyActions.fetchCompanies());
      await dispatch(userActions.fetchUsers());
      await dispatch(deviceActions.fetchDevices());
      await dispatch(appSystemActions.fetchAppSystems());
    };
    loadData();
  }, [dispatch]);

  const [selectedAppSystemId, setSelectedAppSystemId] = useState<string | undefined>();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const params = {} as IFileFilter;
      if (selectedCompanyId) {
        params.companyId = selectedCompanyId;
      }
      if (selectedAppSystemId) {
        params.appSystemId = selectedAppSystemId;
      }

      await dispatch(fileActions.fetchFiles(params));
    })();
  }, [selectedCompanyId, selectedAppSystemId, dispatch]);

  const selectedStyle = {
    border: `1px solid ${palette.primary.main}`,
    borderRadius: 4,
    padding: 14,
  };

  const selectedCompanyStyle = {
    border: `1px solid ${palette.warning.light}`,
    borderRadius: 4,
    padding: 14,
  };

  const handleClickedAppSystem = (id: string) => {
    setSelectedCompanyId(undefined);
    if (selectedAppSystemId === id) {
      setSelectedAppSystemId(undefined);
      return;
    }

    setSelectedAppSystemId(id);
  };

  const handleClickedCompany = (id: string) => {
    if (selectedCompanyId === id) {
      setSelectedCompanyId(undefined);
      return;
    }

    setSelectedCompanyId(id);
  };

  const getUsers = useCallback(
    (appSystemId?: string, companyId?: string) => {
      if (!appSystemId && !companyId) {
        return users;
      }

      return users.filter((u) => {
        const matchesAppSystem = appSystemId
          ? u.appSystem?.id === appSystemId ||
            users.some((erp) => erp.id === u.erpUser?.id && erp.appSystem?.id === appSystemId)
          : true;

        const matchesCompany = companyId ? u.company?.id === companyId : true;

        return matchesAppSystem && matchesCompany && u.role === 'User';
      });
    },
    [users],
  );

  const getDevices = useCallback(
    (appSystemId?: string, companyId?: string) => {
      if (!appSystemId && !companyId) {
        return devices;
      }

      return devices.filter((d) => {
        const matchesAppSystem = appSystemId ? d.appSystem?.id === appSystemId : true;
        const matchesCompany = companyId ? d.company?.id === companyId : true;
        return matchesAppSystem && matchesCompany;
      });
    },
    [devices],
  );

  const filteredUsers = useMemo(() => {
    return getUsers(selectedAppSystemId, selectedCompanyId);
  }, [getUsers, selectedAppSystemId, selectedCompanyId]);

  const filteredDevices = useMemo(() => {
    return getDevices(selectedAppSystemId, selectedCompanyId);
  }, [getDevices, selectedAppSystemId, selectedCompanyId]);

  const companyInfo = useMemo(
    () =>
      (selectedAppSystemId
        ? companies.filter((c) => c.appSystems?.some((s) => s.id === selectedAppSystemId))
        : companies
      ).map((company) => {
        const deviceQuantity = getDevices(selectedAppSystemId, company.id).length;
        const activeDeviceQuantity = getDevices(selectedAppSystemId, company.id).length;
        const userQuantity = getUsers(selectedAppSystemId, company.id).length;
        const activeUserQuantity = getUsers(selectedAppSystemId, company.id).length;
        return {
          id: company.id,
          name: company.name,
          admin: company.admin.name,
          deviceQuantity: `${deviceQuantity}/${activeDeviceQuantity}`,
          userQuantity: `${userQuantity}/${activeUserQuantity}`,
          lastActivity: '2024/09/25',
        };
      }),
    [selectedAppSystemId, companies, getDevices, getUsers],
  );

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          py: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth={false} sx={{ flexGrow: 1 }}>
          {deviceLoading || userLoading || companyLoading || appSystemLoading || filesLoading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item lg={4} sm={6} xl={3} xs={12}>
                  <TotalAppSystems value={appSystems.length} />
                </Grid>
                <Grid item lg={4} sm={6} xl={3} xs={12}>
                  <TotalCompanies value={companies.length} />
                </Grid>
                <Grid item lg={4} sm={6} xl={3} xs={12}>
                  <TotalUsers value={users.length} />
                </Grid>
                <Grid item lg={4} sm={6} xl={3} xs={12}>
                  <TotalDevices value={devices.length} />
                </Grid>
              </Grid>
              <Grid container>
                <Grid container mt={1} spacing={2}>
                  {appSystems.map((appSystem) => (
                    <Grid item lg={4} sm={6} xl={2} xs={12} key={appSystem.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: '0.3s',
                          '&:hover': { boxShadow: 6 },
                        }}
                        onClick={() => handleClickedAppSystem(appSystem.id)}
                      >
                        <CardContent style={appSystem.id === selectedAppSystemId ? selectedStyle : { padding: 14 }}>
                          <Box display="flex" alignItems="center" mb={1} minHeight={28}>
                            <WidgetsIcon sx={{ color: palette.primary.main, marginRight: 1 }} />
                            <Typography variant="h6" lineHeight={1}>
                              {appSystem.name}
                            </Typography>
                          </Box>
                          <Typography color="textSecondary" variant="h6">
                            Компаний: {companies.filter((c) => c.appSystems?.some((s) => s.id === appSystem.id)).length}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Устройств: {getDevices(appSystem.id).length}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Пользователей: {getUsers(appSystem.id).length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Grid container mt={1} spacing={2}>
                  {companyInfo.map((company) => (
                    <Grid item lg={4} sm={6} xl={2} xs={12} key={company.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: '0.3s',
                          '&:hover': { boxShadow: 6 },
                          height: '100%',
                        }}
                        onClick={() => handleClickedCompany(company.id)}
                      >
                        <CardContent
                          style={company.id === selectedCompanyId ? selectedCompanyStyle : { padding: 14 }}
                          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                          <Box display="flex" alignItems="center" mb={1} minHeight={28}>
                            <BusinessCenterIcon sx={{ color: palette.primary.main, marginRight: 1 }} />
                            <Typography lineHeight={1} variant="h6">
                              {company.name}
                            </Typography>
                          </Box>
                          <Typography color="textSecondary" variant="h6">
                            Администратор: {company.admin}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Пользователей: {company.userQuantity}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Устройств: {company.deviceQuantity}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
          {selectedCompanyId && !!filteredUsers.length && (
            <Box>
              <UserDeviceTable users={filteredUsers} devices={filteredDevices} files={files} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
