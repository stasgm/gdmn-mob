import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
// import ImportExportIcon from '@material-ui/icons/ImportExport';
import { IDevice } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import codeActions from '../../store/activationCode';
import { /*IHeadCells,*/ IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
// import SortableTable from '../../components/SortableTable';
import DeviceListTable from '../../components/device/DeviceListTable';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, errorMessage } = useSelector((state) => state.devices);
  const { list: activationCodes } = useSelector((state) => state.activationCodes);

  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const fetchDevices = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchDevices(filterText, fromRecord, toRecord));
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    //!list?.length && fetchDevices();
    fetchDevices();
  }, [fetchDevices]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    if (inputValue) return;

    fetchDevices('');
  };

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchDevices(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    const inputValue = valueRef?.current?.value;

    fetchDevices(inputValue);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleCreateCode = (deviceId: string) => {
    console.log('проверка', deviceId);
    dispatch(codeActions.createActivationCode(deviceId));
  };

  // const handleSubmit = async (values: IDevice | NewDevice) => {
  //   const res = await dispatch(actions.updateDevice(values as IDevice));
  //   if (res.type === 'DEVICE/UPDATE_SUCCESS') {
  //     goBack();
  //   }
  // };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchDevices,
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

  // const headCells: IHeadCells<IDevice>[] = [
  //   { id: 'name', label: 'Наименование', sortEnable: true },
  //   { id: 'uid', label: 'Номер', sortEnable: true },
  //   { id: 'state', label: 'Состояние', sortEnable: false },
  // ];

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
            valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <DeviceListTable devices={list} activationCodes={activationCodes} onCreateCode={handleCreateCode} />
              {/* <SortableTable<IDevice> headCells={headCells} data={list} /> */}
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceList;
