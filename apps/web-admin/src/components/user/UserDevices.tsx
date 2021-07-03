import { Box, Container } from '@material-ui/core';

import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

// import CachedIcon from '@material-ui/icons/Cached';

// import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDeviceBinding } from '@lib/types';

import DeviceBindingListTable from '../deviceBinding/DeviceBindingListTable';
import { IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';

interface IProps {
  userDevices: IDeviceBinding[];
  onAddDevice: () => void;
}

const UserDevices = ({ userDevices, onAddDevice }: IProps) => {
  const deviceButtons: IToolBarButton[] = [
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: onAddDevice,
      icon: <LibraryAddCheckIcon />,
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
          <DeviceBindingListTable deviceBindings={userDevices} limitRows={5} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
