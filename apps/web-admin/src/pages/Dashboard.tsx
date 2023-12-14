import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Grid } from '@mui/material';

import { useEffect, useState } from 'react';

import { IAppSystem, ICompany, IUser } from '@lib/types';

import Companies from '../components/dashboard/GridCompany';

import { useDispatch, useSelector } from '../store';

import TotalCompanies from '../components/dashboard/TotalCompanies';
import TotalUsers from '../components/dashboard/TotalUsers';
import TotalDevices from '../components/dashboard/TotalDevices';
import CompaniesAppSystem from '../components/dashboard/GridAppSystem';
import TotalAppSystems from '../components/dashboard/TotalAppSystems';

import appsystemActions from '../store/appSystem';
import companyActions from '../store/company';
import userActions from '../store/user';
import deviceActions from '../store/device';
import CircularProgressWithContent from '../components/CircularProgressWidthContent';
import SimpleLineChart from '../components/dashboard/ReChart';
import UserDeviseList from '../components/dashboard/UserDeviseList';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: devices, loading: deviceLoading } = useSelector((state) => state.devices);
  const { list: users, loading: userLoading } = useSelector((state) => state.users);
  const { list: companies, loading: companyLoading } = useSelector((state) => state.companies);
  const { list: appSystem, loading: appSystemLoading } = useSelector((state) => state.appSystems);
  const dataTest1 = [
    { name: '01.01.2023', device1: 100, device2: 900, device3: 390 },
    { name: '02.01.2023', device1: 200, device2: 780, device3: 590 },
    { name: '03.01.2023', device1: 300, device2: 600, device3: 490 },
    { name: '04.01.2023', device1: 150, device2: 880, device3: 390 },
    { name: '05.01.2023', device1: 100, device2: 980, device3: 220 },
    { name: '06.01.2023', device1: 300, device2: 600, device3: 390 },
    { name: '07.01.2023', device1: 200, device2: 980, device3: 320 },
  ];

  const dataTest2 = [
    { name: '01.01.2023', device1: 100 },
    { name: '02.01.2023', device1: 200 },
    { name: '03.01.2023', device1: 600 },
    { name: '04.01.2023', device1: 300 },
    { name: '05.01.2023', device1: 900 },
    { name: '06.01.2023', device1: 400 },
    { name: '07.01.2023', device1: 100 },
  ];

  const dataTest3 = [
    { name: '18.01.2024', device1: 100, device2: 900, device3: 390 },
    { name: '25.01.2024', device1: 200, device2: 780, device3: 590 },
    { name: '01.02.2024', device1: 300, device2: 600, device3: 490 },
    { name: '08.02.2024', device1: 150, device2: 880, device3: 390 },
    { name: '15.02.2024', device1: 100, device2: 980, device3: 220 },
  ];

  const dataTest4 = [
    { name: '18.01.2024', device1: 100 },
    { name: '25.01.2024', device1: 200 },
    { name: '01.02.2024', device1: 600 },
    { name: '08.02.2024', device1: 300 },
    { name: '15.02.2024', device1: 900 },
  ];

  const dataTest5 = [
    { name: '18.01.2024', device1: 100, device2: 900, device3: 390 },
    { name: '18.01.2024', device1: 100, device2: 900, device3: 390 },
  ];

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    const loadData = async () => {
      const resp = await dispatch(companyActions.fetchCompanies());
      if (resp.type === 'COMPANY/FETCH_COMPANIES_SUCCESS') {
        const resp = await dispatch(userActions.fetchUsers());
        if (resp.type === 'USER/FETCH_USERS_SUCCESS') {
          const resp = await dispatch(deviceActions.fetchDevices());
          if (resp.type === 'DEVICE/FETCH_DEVICES_SUCCESS') {
            await dispatch(appsystemActions.fetchAppSystems());
          }
        }
      }
    };
    loadData();
  }, [dispatch]);

  const [state, setState] = useState<ICompany[]>([]);
  const [selectedAppSystem, setSelectedAppSystem] = useState<IAppSystem>();
  const [selectedCompany, setSelectedCompany] = useState<ICompany>();
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const date = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<string[]>([
    String(date.getFullYear()) + '.' + String(date.getMonth() + 1) + '.' + String(date.getDate()),
    String(date.getFullYear()) + '.' + String(date.getMonth() + 1) + '.' + String(date.getDate()),
  ]);

  console.log('state', state);

  const handleSetStateAppSystem = (appSystem: IAppSystem) => {
    setSelectedAppSystem(appSystem);
    const companyList = companies.filter((item) => item.appSystems?.find((i) => i.id === appSystem.id));
    setState(companyList);
  };

  const handleSetStateCompany = (company: ICompany) => {
    setSelectedCompany(company);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <Typography color="textPrimary" variant="h4">
              Общая информация
            </Typography>
          </Box>
          {deviceLoading || userLoading || companyLoading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Grid container spacing={3}>
              <Grid item lg={4} sm={6} xl={3} xs={12}>
                <TotalAppSystems value={appSystem.length} />
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
          )}
        </Container>
        <Container maxWidth={false}>
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <Typography color="textPrimary" variant="h4"></Typography>
          </Box>
          {appSystemLoading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Grid container spacing={3}>
              {appSystem.map((item, index) => (
                // eslint-disable-next-line react/jsx-key
                <Grid item xs={12} sm={6} lg={4} xl={3} md={4} key={index}>
                  <CompaniesAppSystem
                    appSystem={item}
                    onClick={() => handleSetStateAppSystem(item)}
                    selectedAppSystem={selectedAppSystem}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        <Container maxWidth={false}>
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <Typography color="textPrimary" variant="h4"></Typography>
          </Box>
          <Grid container spacing={3}>
            {state.map((item, index) => (
              // eslint-disable-next-line react/jsx-key
              <Grid item xs={12} sm={6} lg={4} xl={3} md={4} key={index}>
                <Companies
                  company={state[index]}
                  onClick={() => handleSetStateCompany(item)}
                  selectedCompany={selectedCompany}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
        <UserDeviseList
          company={selectedCompany}
          onClickUser={(selectedUser) => {
            setSelectedUser(selectedUser);
          }}
          onClickSelectedPeriod={(timePeriod) => setSelectedPeriod(timePeriod)}
        />
        <SimpleLineChart data={dataTest3} company={selectedCompany} />
      </Box>
    </>
  );
};
export default Dashboard;
