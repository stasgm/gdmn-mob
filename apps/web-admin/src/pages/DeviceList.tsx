import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { devices } from '@lib/mock';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import DeviceListResults from '../components/device/DeviceListResults111';
import ToolbarActionsWithSearch from '../components/ToolbarActionsWithSearch';
import { IToolBarButton } from '../types';

const DeviceList = () => {
  const buttons: IToolBarButton[] = [
    {
      name: 'Load',
      onClick: () => {
        return;
      },
      icon: <CachedIcon />,
    },
    {
      name: 'Import',
      onClick: () => {
        return;
      },
      icon: <ImportExportIcon />,
    },
    {
      name: 'Export',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
    },
    {
      name: ' Add company',
      color: 'primary',
      variant: 'contained',
      onClick: () => {
        return;
      },
      icon: <AddCircleOutlineIcon />,
    },
  ];

  return (
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
          <ToolbarActionsWithSearch buttons={buttons} searchTitle={'Найти устройство'} />
          <Box sx={{ pt: 3 }}>
            <DeviceListResults devices={devices} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DeviceList;
