import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Grid } from '@material-ui/core';

// import TotalUsers from '../components/account/AccountProfile';

import TotalUsers from '../components/dashboard/Totals';

// import Budget from '../components/dashboard/Budget';
// import LatestOrders from '../components/dashboard/LatestOrders';
// import LatestProducts from '../components/dashboard/LatestProducts';
// import Sales from '../components/dashboard/Sales';
// import TasksProgress from '../components/dashboard/TasksProgress';
// import TotalProfit from '../components/dashboard/TotalProfit';
// import TrafficByDevice from '../components/dashboard//TrafficByDevice';

const Dashboard = () => (
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
            Cводная информация
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid> */}
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers totalusers={10} />
          </Grid>
          {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </>
);

export default Dashboard;
