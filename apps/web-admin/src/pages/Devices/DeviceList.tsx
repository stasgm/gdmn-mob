import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import deviceActions from '../../store/device';
import codeActions from '../../store/activationCode';
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
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceActions.fetchDevices(filterText, fromRecord, toRecord));
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  const fetchActivationCodes = useCallback(
    (deviceId?: string) => {
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  useEffect(() => {
    fetchDevices(pageParams?.filterText as string);
  }, [fetchDevices, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchDevices('');
  };

  const handleSearchClick = () => {
    dispatch(deviceActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchDevices(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(deviceActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchDevices();
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
      sx: { mx: 1 },
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
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <DeviceListTable
                devices={list}
                activationCodes={activationCodes}
                onCreateCode={handleCreateCode}
                onCreateUid={handleCreateUid}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DeviceList;
