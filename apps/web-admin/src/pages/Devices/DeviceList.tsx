import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IDevice, IHeadCells } from '@lib/types';

import DeviceListTable from '../../components/device/DeviceListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';
import SortableTable from '../../components/SortableTable';

const DeviceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.devices);
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const fetchDevices = useCallback(
    async (filterText?: string, fromRecord?: number, toRecord?: number) => {
      const res = await dispatch(actions.fetchDevices(filterText, fromRecord, toRecord));

      if (res.type === 'DEVICE/FETCH_DEVICES_SUCCESS') {
        //setDataList(res.payload);
      }
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

  const headCells: IHeadCells<IDevice>[] = [
    { id: 'name', label: 'Наименование', sortEnable: true },
    { id: 'uid', label: 'Номер', sortEnable: true },
    { id: 'state', label: 'Состояние', sortEnable: false },
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
            valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <SortableTable<IDevice> headCells={headCells} data={list} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DeviceList;
