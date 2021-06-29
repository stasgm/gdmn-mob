import { Box, Container } from '@material-ui/core';

import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

// import CachedIcon from '@material-ui/icons/Cached';

// import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDevice } from '@lib/types';

import DeviceListTable from '../device/DeviceListTable';
import { IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';

interface IProps {
  devices: IDevice[];
  onAddDevice: () => void;
  // onSave: (selectedDevices: IDevice[]) => void;
  // onAddDevicesClick?: (value: boolean) => void;
  // sourcePath?: string;
  // isAddDevices?: boolean;
}

const UserDevices = ({ devices, onAddDevice }: IProps) => {
  // const navigate = useNavigate();
  // const [isAddDevices, setIsAddDevices] = useState(false);
  // const [selectedDevices, setSelectedDevices] = useState<IDevice[]>(devices || []);

  // const handleAddClick = (value: boolean) => {
  //   onAddDevicesClick && onAddDevicesClick(value);
  // };

  const deviceButtons: IToolBarButton[] = [
    {
      name: 'Добавить устройство',
      color: 'primary',
      variant: 'contained',
      onClick: onAddDevice,
      icon: <LibraryAddCheckIcon />,
    },
  ];

  // /** изменение списка новых выбранных девайсов  */
  // const handleChangeSelectedDevices = (value: any[]) => {
  //   console.log('handleChangeSelectedDevices', value);
  //   setSelectedDevices(value);
  // };

  // const handleSave = () => {
  //   onSave(selectedDevices);
  //   setIsAddDevices(false);
  // };

  // const handleCancel = () => {
  //   setIsAddDevices(false);
  // };

  // useEffect(() => {
  //   setSelectedDevices(devices);
  // }, [devices]);

  // interface UserDetailProps {
  //   isAddingDevice: boolean;
  //   // sourcePath?: string;
  // }

  // const UserDetail = (props: UserDetailProps) => {
  //   const { isAddingDevice } = props;

  //   if (isAddingDevice) {
  //     return (
  //       <UserSelectDevices
  //         devices={selectedDevices}
  //         onSaveClick={onSave}
  //         onCancelClick={handleCancelClick}
  //         onChangeSelectedDevices={handleChangeSelectedDevices}
  //         // sourcePath={sourcePath}
  //       />
  //     );
  //   }

  //   return (
  //     <div>
  //       <ToolbarActionsWithSearch buttons={deviceButtons} searchTitle={'Найти устройство'} />
  //       <Box sx={{ pt: 2 }}>
  //         <DeviceListTable devices={devices} limitRows={5} />
  //       </Box>
  //     </div>
  //   );
  // };

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
          <DeviceListTable devices={devices} limitRows={5} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
