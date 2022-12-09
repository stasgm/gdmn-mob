import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Grid } from '@material-ui/core';

import { useCallback, useEffect } from 'react';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import { useDispatch, useSelector } from '../store';

import TotalCompanies from '../components/dashboard/Totalcompanies';
import TotalUsers from '../components/dashboard/Totalusers';
import TotalDevices from '../components/dashboard/Totaldevices';

import companyActions from '../store/company';
import userActions from '../store/user';
import deviceActions from '../store/device';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: devices } = useSelector((state) => state.devices);
  const { list: users } = useSelector((state) => state.users);
  const { list: companies } = useSelector((state) => state.companies);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    const loadData = async () => {
      await dispatch(companyActions.fetchCompanies());
      await dispatch(userActions.fetchUsers());
      await dispatch(deviceActions.fetchDevices());
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
