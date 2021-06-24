import { useEffect, useState } from 'react';
import { Box, Container } from '@material-ui/core';

import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

// import CachedIcon from '@material-ui/icons/Cached';

// import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDevice } from '@lib/types';

import DeviceListTable from '../device/DeviceListTable';
import { IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';

import UserSelectDevices from './UserSelectDevices';

interface props {
  devices: IDevice[];
  handleDeviceListSave: (newDeviceList: IDevice[]) => void;
  onAddDevicesClick?: (value: boolean) => void;
  sourcePath?: string;
  isAddDevices?: boolean;
}

const UserDevices = ({ devices, handleDeviceListSave, onAddDevicesClick, sourcePath, isAddDevices = false }: props) => {
  //const navigate = useNavigate();
  //  const [isAddDevices, setIsAddDevices] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<IDevice[]>([]);

  const handleAddClick = (value: boolean) => {
    onAddDevicesClick && onAddDevicesClick(value);
  };

  const deviceButtons: IToolBarButton[] = [
    // {
    //   name: 'Обновить',
    //   sx: { mx: 1 },
    //   onClick: fetchDevices,
    //   icon: <CachedIcon />,
    // },
    // {
    //   name: 'Загрузить',
    //   onClick: () => {
    //     return;
    //   },
    //   icon: <ImportExportIcon />,
    // },
    // {
    //   name: 'Выгрузить',
    //   sx: { mx: 1 },
    //   onClick: () => {
    //     return;
    //   },
    // },
    {
      name: 'Выбрать',
      color: 'primary',
      variant: 'contained',
      onClick: () => handleAddClick(true),
      icon: <LibraryAddCheckIcon />,
    },
  ];

  /** изменение списка новых выбранных девайсов  */
  const handleChangeSelectedDevices = (value: any[]) => {
    console.log('handleChangeSelectedDevices', value);
    setSelectedDevices(value);
  };

  const handleSaveClick = () => {
    onAddDevicesClick && onAddDevicesClick(false);

    handleDeviceListSave(selectedDevices);
  };

  const handleCancelClick = () => {
    onAddDevicesClick && onAddDevicesClick(false);
  };

  useEffect(() => {
    setSelectedDevices(devices);
  }, [devices]);
  interface UserDetailProps {
    isAddingDevice: boolean;
    sourcePath?: string;
  }

  const UserDetail = (props: UserDetailProps) => {
    const { isAddingDevice } = props;

    if (isAddingDevice) {
      return (
        <UserSelectDevices
          devices={selectedDevices}
          onSaveClick={handleSaveClick}
          onCancelClick={handleCancelClick}
          onChangeSelectedDevices={handleChangeSelectedDevices}
          sourcePath={sourcePath}
        />
      );
    }

    return (
      <div>
        <ToolbarActionsWithSearch buttons={deviceButtons} searchTitle={'Найти устройство'} />
        <Box sx={{ pt: 2 }}>
          <DeviceListTable devices={devices} limitRows={5} sourcePath={sourcePath} />
        </Box>
      </div>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <UserDetail isAddingDevice={isAddDevices} />
      </Container>
    </Box>
  );
};

export default UserDevices;
