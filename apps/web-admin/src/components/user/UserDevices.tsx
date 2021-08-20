import { Box, Container } from '@material-ui/core';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { IDeviceBinding, IDevice } from '@lib/types';

import { useCallback, useEffect, useRef } from 'react';
import SortableTable from '../../components/SortableTable';

import DeviceBindingListTable from '../deviceBinding/DeviceBindingListTable';
import { IHeadCells, IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import actionsBinding from '../../store/deviceBinding';
import { deviceBinding } from '@lib/mock';
import { deviceStates } from '../../utils/constants';

interface IProps {
  userDevices: IDevice[];
  userBindingDevices: IDeviceBinding[];
  onAddDevice: () => void;
}

const UserDevices = ({ userDevices, userBindingDevices, onAddDevice }: IProps) => {
  //const { list /*, loading, errorMessage */ } = useSelector((state) => state.devices);
  const dispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchDevices(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  const fetchDeviceBindings = useCallback(
    (userId?: string, filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actionsBinding.fetchDeviceBindings(userId, /* '',*/ filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  // useEffect(() => {
  //   fetchDevices();
  // }, [fetchDevices]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    if (inputValue) return;

    fetchDeviceBindings('');
  };

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchDeviceBindings(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    const inputValue = valueRef?.current?.value;

    fetchDeviceBindings(inputValue);
  };

  const deviceButtons: IToolBarButton[] = [
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: onAddDevice,
      icon: <LibraryAddCheckIcon />,
    },
  ];

  // const headCells: IHeadCells<IDevice>[] = [
  //   { id: 'name', label: 'Наименование', sortEnable: true },
  //   { id: 'state', label: 'Состояние', sortEnable: true },
  //   { id: 'creationDate', label: 'Дата создания', sortEnable: false },
  //   { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
  // ];

  const headCells: IHeadCells<IDeviceBinding>[] = [
    { id: 'device', label: 'Наименование', sortEnable: true },
    { id: 'state', label: 'Состояние', sortEnable: true },
    { id: 'creationDate', label: 'Дата создания', sortEnable: false },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <ToolbarActionsWithSearch
          buttons={deviceButtons}
          searchTitle={'Найти устройство'}
          valueRef={valueRef}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
        />
        <Box sx={{ pt: 2 }}>
          {/* <DeviceBindingListTable deviceBindings={userBindingDevices} limitRows={5} /> */}
          <SortableTable<IDeviceBinding>
            headCells={headCells}
            data={userBindingDevices}
            path={`/app/users/${deviceBinding.user.id}/binding/`}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
