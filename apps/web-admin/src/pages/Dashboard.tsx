import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Grid } from '@mui/material';

import { useEffect } from 'react';

import { useDispatch, useSelector } from '../store';

import TotalCompanies from '../components/dashboard/Totalcompanies';
import TotalUsers from '../components/dashboard/Totalusers';
import TotalDevices from '../components/dashboard/Totaldevices';

import companyActions from '../store/company';
import userActions from '../store/user';
import deviceActions from '../store/device';
import CircularProgressWithContent from '../components/CircularProgressWidthContent';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: devices, loading: deviceLoading } = useSelector((state) => state.devices);
  const { list: users, loading: userLoading } = useSelector((state) => state.users);
  const { list: companies, loading: companyLoading } = useSelector((state) => state.companies);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    const loadData = async () => {
      const resp = await dispatch(companyActions.fetchCompanies());
      if (resp.type === 'COMPANY/FETCH_COMPANIES_SUCCESS') {
        const resp = await dispatch(userActions.fetchUsers());
        if (resp.type === 'USER/FETCH_USERS_SUCCESS') {
          await dispatch(deviceActions.fetchDevices());
        }
      }
    };
    loadData();
  }, [dispatch]);

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
      </Box>
    </>
  );
};

export default Dashboard;
