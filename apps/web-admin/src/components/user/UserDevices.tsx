import { Box } from '@mui/material';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

import { useCallback, useEffect, useState } from 'react';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import { useNavigate } from 'react-router';

import { IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import { bindingActions, bindingSelectors } from '../../store/deviceBinding';
import { deviceActions } from '../../store/device';
import { codeActions } from '../../store/activationCode';
import DeviceBindingListTable from '../deviceBinding/DeviceBindingListTable';
import { webRequest } from '../../store/webRequest';
import { adminPath } from '../../utils/constants';

interface IProps {
  userId: string;
}

const UserDevices = ({ userId }: IProps) => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const navigate = useNavigate();
  const { pageParams } = useSelector((state) => state.deviceBindings);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);
  const { list: activationCodes } = useSelector((state) => state.activationCodes);
  const { list: devices } = useSelector((state) => state.devices);
  const userBindingDevices = bindingSelectors.bindingsByUserId(userId);

  const handleAddDevice = () => {
    navigate(`${adminPath}/app/users/${userId}/binding/new`);
  };

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceActions.fetchDevices(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  const fetchDeviceBindings = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(bindingActions.fetchDeviceBindings(userId, filterText, fromRecord, toRecord));
    },
    [dispatch, userId],
  );

  const fetchActivationCodes = useCallback(
    (_deviceId?: string) => {
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    fetchActivationCodes();
    fetchDevices(pageParams?.filterText);
    fetchDeviceBindings(pageParams?.filterText);
  }, [fetchActivationCodes, fetchDeviceBindings, fetchDevices, pageParams?.filterText]);

  const handleCreateUid = async (code: string, deviceId: string) => {
    await authDispatch(authActions.activateDevice(webRequest(authDispatch, authActions), code));
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
    dispatch(bindingActions.setPageParam({ filterText: pageParamLocal?.filterText }));

    fetchDeviceBindings(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(deviceActions.setPageParam({ filterText: undefined }));
    dispatch(bindingActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchDevices();
    fetchDeviceBindings();
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
      onClick: handleAddDevice,
      icon: <LibraryAddCheckIcon />,
    },
  ];

  return (
    <Box>
      <ToolbarActionsWithSearch
        buttons={deviceButtons}
        searchTitle={'Найти устройство'}
        updateInput={handleUpdateInput}
        searchOnClick={handleSearchClick}
        keyPress={handleKeyPress}
        value={(pageParamLocal?.filterText as undefined) || ''}
        clearOnClick={handleClearSearch}
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
    </Box>
  );
};

export default UserDevices;
