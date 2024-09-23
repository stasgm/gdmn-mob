import { Box } from '@mui/material';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { authActions, useAuthThunkDispatch } from '@lib/store';
import CachedIcon from '@mui/icons-material/Cached';

import { useNavigate } from 'react-router';

import { IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import { bindingActions, bindingSelectors } from '../../store/deviceBinding';
import { deviceActions } from '../../store/device';
import { codeActions } from '../../store/activationCode';
import { webRequest } from '../../store/webRequest';
import { adminPath } from '../../utils/constants';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import DeviceListTable from '../device/DeviceListTable';

interface IProps {
  userId: string;
}

const UserDevices = ({ userId }: IProps) => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const navigate = useNavigate();

  const { list: activationCodes, loading: codeLoading } = useSelector((state) => state.activationCodes);
  const { list, loading: deviceLoading } = useSelector((state) => state.devices);
  const { loading: bindingLoading } = useSelector((state) => state.deviceBindings);
  const userBindingDevices = bindingSelectors.bindingsByUserId(userId);

  const devices = useMemo(
    () => list.filter((device) => userBindingDevices.some((binding) => binding.device.id === device.id)),
    [list, userBindingDevices],
  );

  const { pageParams } = useSelector((state) => state.deviceBindings);
  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const handleAddDevice = () => {
    navigate(`${adminPath}/app/users/${userId}/binding/new`);
  };

  const fetchData = useCallback(() => {
    dispatch(codeActions.fetchActivationCodes());
    dispatch(deviceActions.fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      dispatch(bindingActions.fetchDeviceBindings(userId, pageParams?.filterText));
    }
  }, [dispatch, pageParams?.filterText, userId]);

  const handleCreateUid = async (code: string, deviceId: string) => {
    await authDispatch(authActions.activateDevice(webRequest(authDispatch, authActions), code));
    dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(codeActions.fetchActivationCodes());
  };

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;

    dispatch(bindingActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(bindingActions.setPageParam({ filterText }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(deviceActions.setPageParam({ filterText: '', page: 0 }));
    dispatch(bindingActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.createActivationCode(deviceId));
    dispatch(codeActions.fetchActivationCodes());
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        bindingActions.setPageParam({
          page: pageParams.page,
          limit: pageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const deviceButtons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchData,
      icon: <CachedIcon />,
    },
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
        value={filterText}
        clearOnClick={handleClearSearch}
        disabled={deviceLoading || bindingLoading || codeLoading}
      />
      {deviceLoading || bindingLoading || codeLoading ? (
        <CircularProgressWithContent content={'Идет загрузка данных...'} />
      ) : (
        <Box sx={{ pt: 2 }}>
          <DeviceListTable
            devices={devices}
            activationCodes={activationCodes}
            onCreateCode={handleCreateCode}
            onCreateUid={handleCreateUid}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserDevices;
