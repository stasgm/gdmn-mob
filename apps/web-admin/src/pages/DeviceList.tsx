import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import devices from '../__mocks__/devices';

import DeviceListResults from '../components/device/DeviceListResults';
import DeviceListToolbar from '../components/device/DeviceListToolbar';

const DeviceList = () => (
  <>
    <Helmet>
      <title>devices | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <DeviceListToolbar />
        <Box sx={{ pt: 3 }}>
          <DeviceListResults devices={devices} />
        </Box>
      </Container>
    </Box>
  </>
);

export default DeviceList;
