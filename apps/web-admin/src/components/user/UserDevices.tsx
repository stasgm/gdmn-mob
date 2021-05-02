import { Box, Container } from '@material-ui/core';

import { useNavigate } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

// import CachedIcon from '@material-ui/icons/Cached';

import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDevice } from '@lib/types';

import DeviceListTable from '../device/DeviceListTable';
import { IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';

interface props {
  devices: IDevice[];
}

const UserDevices = ({ devices }: props) => {
  const navigate = useNavigate();

  const deviceButtons: IToolBarButton[] = [
    // {
    //   name: 'Обновить',
    //   sx: { mx: 1 },
    //   onClick: () => {
    //     return;
    //   },
    //   icon: <CachedIcon />,
    // },
    {
      name: 'Загрузить',
      onClick: () => {
        return;
      },
      icon: <ImportExportIcon />,
    },
    {
      name: 'Выгрузить',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
    },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate('app/devices/new'),
      icon: <AddCircleOutlineIcon />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <ToolbarActionsWithSearch buttons={deviceButtons} searchTitle={'Найти устройство'} />
        <Box sx={{ pt: 2 }}>
          <DeviceListTable devices={devices} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
