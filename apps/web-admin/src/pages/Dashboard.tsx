import { Box, Container, Typography, Grid, CardContent, Card, useTheme } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import WidgetsIcon from '@mui/icons-material/Widgets';

import { INamedEntity } from '@lib/types';

import { useDispatch, useSelector } from '../store';

import TotalCompanies from '../components/dashboard/Totalcompanies';
import TotalUsers from '../components/dashboard/Totalusers';
import TotalDevices from '../components/dashboard/Totaldevices';

import { companyActions } from '../store/company';
import { userActions } from '../store/user';
import { deviceActions } from '../store/device';
import CircularProgressWithContent from '../components/CircularProgressWidthContent';
import { appSystemActions } from '../store/appSystem';
import { IHeadCells } from '../types';
import SortableTable from '../components/SortableTable';
import TotalAppSystems from '../components/dashboard/Totalappsystems';

interface ICompanyInfo extends INamedEntity {
  deviceQuantity: string;
  userQuantity: string;
  lastActivity: string;
}

const companiesCells: IHeadCells<ICompanyInfo>[] = [
  { id: 'name', label: 'Наименование', sortEnable: true },
  { id: 'deviceQuantity', label: 'Устройств/из них активных', sortEnable: true },
  { id: 'userQuantity', label: 'Пользователей/из них активных', sortEnable: true },
  { id: 'lastActivity', label: 'Последняя активность', sortEnable: true, type: 'date' },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { list: devices, loading: deviceLoading } = useSelector((state) => state.devices);
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

  const companyInfo = useMemo(
    () =>
      (selectedAppSystemId
        ? companies.filter((c) => c.appSystems?.some((s) => s.id === selectedAppSystemId))
        : companies
      ).map((company) => {
        const deviceQuantity = devices.filter((d) => d.company?.id === company.id).length;
        const activeDeviceQuantity = devices.filter((d) => d.company?.id === company.id).length;
        const userQuantity = users.filter((u) => u.company?.id === company.id).length;
        const activeUserQuantity = users.filter((u) => u.company?.id === company.id).length;
        return {
          id: company.id,
          name: company.name,
          deviceQuantity: `${deviceQuantity}/${activeDeviceQuantity}`,
          userQuantity: `${userQuantity}/${activeUserQuantity}`,
          lastActivity: '2024/09/25',
        };
      }),
    [companies, devices, selectedAppSystemId, users],
  );

  const selectedStyle = {
    border: `1px solid ${palette.primary.main}`,
    borderRadius: 4,
  };

  const handleClickedAppSystem = (id: string) => {
    if (selectedAppSystemId === id) {
      setSelectedAppSystemId(undefined);
      return;
    }

    setSelectedAppSystemId(id);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {deviceLoading || userLoading || companyLoading || appSystemLoading ? (
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
                    <Grid item lg={4} sm={6} xl={3} xs={12} key={appSystem.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: '0.3s',
                          '&:hover': { boxShadow: 6 },
                        }}
                        onClick={() => handleClickedAppSystem(appSystem.id)}
                      >
                        <CardContent style={appSystem.id === selectedAppSystemId ? selectedStyle : undefined}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <WidgetsIcon sx={{ color: palette.primary.main, marginRight: 1 }} />
                            <Typography variant="h5">{appSystem.name}</Typography>
                          </Box>
                          <Typography color="textSecondary" variant="h6">
                            Компаний: {companies.filter((c) => c.appSystems?.some((s) => s.id === appSystem.id)).length}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Устройств: {devices.filter((d) => d.appSystem?.id === appSystem.id).length}
                          </Typography>
                          <Typography color="textSecondary" variant="h6">
                            Пользователей: {users.filter((u) => u.appSystem?.id === appSystem.id).length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Grid item lg={12} sm={12} xl={12} xs={12} pt={2}>
                  <Box>
                    <SortableTable<ICompanyInfo>
                      headCells={companiesCells}
                      data={companyInfo}
                      path={'/app/companies/'}
                      byMaxHeight={true}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
