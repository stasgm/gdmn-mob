import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { devices } from '@lib/mock';

import DeviceListResults from '../components/device/DeviceListResults';
import TopToolbar from '../components/TopToolbar';

const DeviceList = () => (
  <>
    <Helmet>
      <title>devices</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <TopToolbar />
        <Box sx={{ pt: 3 }}>
          <DeviceListResults devices={devices} />
        </Box>
      </Container>
    </Box>
  </>
);

export default DeviceList;
