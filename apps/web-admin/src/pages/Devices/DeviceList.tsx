import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDevice } from '@lib/types';

import DeviceListTable from '../../components/device/DeviceListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.devices);
  const [dataList, setDataList] = useState<IDevice[]>([]);

  const fetchDevices = useCallback(async () => {
    const res = await dispatch(actions.fetchDevices());

    if (res.type === 'DEVICE/FETCH_DEVICES_SUCCESS') {
      setDataList(res.payload);
    }
  }, [dispatch]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    !list?.length && fetchDevices();
  }, [fetchDevices, list.length]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value.toUpperCase();

    const filtered = list.filter((item) => {
      const name = item.name.toUpperCase();

      return name.includes(inputValue);
    });

    setDataList(filtered);
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchDevices(),
      icon: <CachedIcon />,
    },
    {
      name: 'Загрузить',
      onClick: () => {
        return;
      },
      icon: <ImportExportIcon />,
    },
    {
      name: 'Выгрузить',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
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
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <DeviceListTable devices={dataList} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DeviceList;
