import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
// import ImportExportIcon from '@material-ui/icons/ImportExport';
import { IDevice } from '@lib/types';

import DeviceListTable from '../../components/device/DeviceListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import codeActions from '../../store/activationCode';
import { IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, errorMessage } = useSelector((state) => state.devices);
  const { list: activationCodes } = useSelector((state) => state.activationCodes);

  console.log('activationCodes', activationCodes);

  const [dataList, setDataList] = useState<IDevice[]>(list);

  const fetchData = useCallback(() => {
    dispatch(actions.fetchDevices());
    dispatch(codeActions.fetchActivationCodes());
  }, [dispatch]);

  // const fetchActivationCodes = useCallback(() => {
  //   dispatch(codeActions.fetchActivationCodes());
  // }, [dispatch]);

  // const getActivationCode = (deviceId: string) => {
  //   dispatch(codeActions.fetchActivationCode());
  // }

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setDataList(list);
  }, [list]);

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const handleUpdateInput = useCallback(
    (value: string) => {
      const inputValue: string = value.toUpperCase();

      const filtered = list.filter((item) => {
        const name = item.name.toUpperCase();

        return name.includes(inputValue);
      });

      setDataList(filtered);
    },
    [list],
  );

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.(deviceId));
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
      onClick: fetchData,
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

  // import { activationCodes } from '@lib/mock';

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
          <ToolbarActionsWithSearch buttons={buttons} title={'Найти устройство'} onChangeValue={handleUpdateInput} />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <DeviceListTable devices={dataList} activationCodes={activationCodes} onCreateCode={handleCreateCode} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceList;
