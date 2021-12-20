import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import codeActions from '../../store/activationCode';
import { IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import DeviceListTable from '../../components/device/DeviceListTable';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const { list, loading, errorMessage, pageParams } = useSelector((state) => state.devices);
  const { list: activationCodes } = useSelector((state) => state.activationCodes);

  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchDevices(filterText, fromRecord, toRecord));
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  const fetchActivationCodes = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
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
    dispatch(actions.deviceActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchDevices(pageParamLocal?.filterText as string);

    // const inputValue = valueRef?.current?.value;
    // fetchDevices(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
    // const inputValue = valueRef?.current?.value;
    // fetchDevices(inputValue);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.createActivationCode(deviceId));
    fetchActivationCodes(deviceId);
  };

  const handleCreateUid = async (code: string, deviceId: string) => {
    await authDispatch(authActions.activateDevice(code));
    dispatch(actions.fetchDeviceById(deviceId));
    fetchActivationCodes(deviceId);
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchDevices(),
      icon: <CachedIcon />,
    },
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
            //valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
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
              />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceList;
