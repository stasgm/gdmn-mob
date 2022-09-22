import { Box, Container } from '@material-ui/core';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { IDeviceBinding } from '@lib/types';

import { useCallback, useEffect, useState } from 'react';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import { IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import actionsBinding from '../../store/deviceBinding';
import deviceActions from '../../store/device';
import codeActions from '../../store/activationCode';
import DeviceBindingListTable from '../deviceBinding/DeviceBindingListTable';

interface IProps {
  userId: string;
  userBindingDevices: IDeviceBinding[];
  onAddDevice: () => void;
}

const UserDevices = ({ userId, userBindingDevices, onAddDevice }: IProps) => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  // const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { pageParams } = useSelector((state) => state.deviceBindings);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const { list: activationCodes } = useSelector((state) => state.activationCodes);
  const { list: devices } = useSelector((state) => state.devices);

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceActions.fetchDevices(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  const fetchDeviceBindings = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actionsBinding.fetchDeviceBindings(userId, filterText, fromRecord, toRecord));
    },
    [dispatch, userId],
  );

  const fetchActivationCodes = useCallback(
    (deviceId?: string) => {
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    fetchActivationCodes();
    fetchDevices(pageParams?.filterText as string);
    fetchDeviceBindings(pageParams?.filterText as string);
  }, [fetchActivationCodes, fetchDeviceBindings, fetchDevices, pageParams?.filterText]);

  const handleCreateUid = async (code: string, deviceId: string) => {
    await authDispatch(authActions.activateDevice(code));
    dispatch(deviceActions.fetchDeviceById(deviceId));
    fetchActivationCodes(deviceId);
  };

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchDeviceBindings('');
  };

  const handleSearchClick = () => {
    dispatch(actionsBinding.deviceBindingActions.setPageParam({ filterText: pageParamLocal?.filterText }));

    fetchDeviceBindings(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.createActivationCode(deviceId));
    fetchActivationCodes(deviceId);
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
          // valueRef={valueRef}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
          value={(pageParamLocal?.filterText as undefined) || ''}
        />
        <Box sx={{ pt: 2 }}>
          <DeviceBindingListTable
            devices={devices}
            deviceBindings={userBindingDevices}
            activationCodes={activationCodes}
            onCreateCode={handleCreateCode}
            onCreateUid={handleCreateUid}
            limitRows={5}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
