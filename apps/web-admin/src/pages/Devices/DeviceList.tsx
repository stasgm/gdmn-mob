import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CachedIcon from '@mui/icons-material/Cached';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { deviceActions } from '../../store/device';
import { codeActions } from '../../store/activationCode';
import { IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import DeviceListTable from '../../components/device/DeviceListTable';
import { webRequest } from '../../store/webRequest';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const { list, loading, pageParams } = useSelector((state) => state.devices);
  const { list: activationCodes } = useSelector((state) => state.activationCodes);

  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  useEffect(() => {
    dispatch(deviceActions.setPageParam({ tab: 0 }));
  }, [dispatch]);

  const fetchDevices = useCallback(() => {
    dispatch(deviceActions.fetchDevices(pageParams?.filterText));
    dispatch(codeActions.fetchActivationCodes());
  }, [dispatch, pageParams?.filterText]);

  const fetchActivationCodes = useCallback(
    (_deviceId?: string) => {
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchDevices();
    }
  }, [fetchDevices, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;

    dispatch(deviceActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(deviceActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(deviceActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.createActivationCode(deviceId));
    fetchActivationCodes(deviceId);
  };

  const handleCreateUid = async (code: string, deviceId: string) => {
    await authDispatch(authActions.activateDevice(webRequest(dispatch, authActions), code));
    dispatch(deviceActions.fetchDeviceById(deviceId));
    fetchActivationCodes(deviceId);
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        deviceActions.setPageParam({
          page: pageParams.page,
          limit: pageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mr: 1 },
      onClick: () => fetchDevices(),
      icon: <CachedIcon />,
    },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate(`${location.pathname}/new`),
      icon: <AddCircleOutlineIcon />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Устройства</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <ToolbarActionsWithSearch
            buttons={buttons}
            searchTitle={'Найти устройство'}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={filterText}
            clearOnClick={handleClearSearch}
            disabled={loading}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <DeviceListTable
              devices={list}
              activationCodes={activationCodes}
              onCreateCode={handleCreateCode}
              onCreateUid={handleCreateUid}
              onSetPageParams={handleSetPageParams}
              pageParams={pageParams}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default DeviceList;
