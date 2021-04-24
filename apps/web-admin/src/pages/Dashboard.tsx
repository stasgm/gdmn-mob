import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Grid } from '@material-ui/core';

import { useSelector } from '../store';

import TotalCompanies from '../components/dashboard/Totalcompanies';
import TotalUsers from '../components/dashboard/Totalusers';
import TotalDevices from '../components/dashboard/Totaldevices';

const Dashboard = () => {
  const { list: devices } = useSelector((state) => state.devices);
  const { list: users } = useSelector((state) => state.users);
  const { list: companies } = useSelector((state) => state.companies);

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
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCompanies value={companies.length} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalUsers value={users.length} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalDevices value={devices.length} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
