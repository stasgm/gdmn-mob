import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@material-ui/icons/Cached';
import FilterIcon from '@material-ui/icons/FilterAltOutlined';

import { IDeviceLogFiles } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import { IHeadCells, IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import DeviceLogFilesListTable from '../../components/deviceLogs/DeviceLogFilesListTable';
import deviceLogActions from '../../store/deviceLog';

const DeviceLogFilesList = () => {
  const dispatch = useDispatch();

  const { filesList, loading, errorMessage, pageParams } = useSelector((state) => state.deviceLogs);

  const fetchDeviceLogFiles = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceLogActions.fetchDeviceLogFiles());
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFiles(pageParams?.filterText as string);
  }, [fetchDeviceLogFiles, pageParams?.filterText]);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const [filterVisible, setFilterVisible] = useState(false);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;
  };

  const handleSearchClick = () => {
    dispatch(actions.deviceActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchDeviceLogFiles(pageParamLocal?.filterText as string);
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

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchDeviceLogFiles(),
      icon: <CachedIcon />,
    },
    {
      name: 'Фильтр',
      sx: { mx: 1 },
      onClick: () => setFilterVisible(!filterVisible),
      icon: <FilterIcon />,
    },
  ];

  const headCells: IHeadCells<IDeviceLogFiles>[] = [
    // { id: 'path', label: 'Название', sortEnable: true, filterEnable: true },
    { id: 'company', label: 'Компания', sortEnable: true, filterEnable: true },
    { id: 'appSystem', label: 'Подсистема', sortEnable: true, filterEnable: true },
    { id: 'contact', label: 'Пользователь', sortEnable: true, filterEnable: true },
    { id: 'device', label: 'Утсройство', sortEnable: false, filterEnable: true },
    { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true },
    { id: 'size', label: 'Размер', sortEnable: true, filterEnable: false },
  ];

  return (
    <>
      <Helmet>
        <title>Журнал ошибок</title>
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
            searchTitle={'Найти файл'}
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
              <DeviceLogFilesListTable
                deviceLogFiles={filesList}
                isFilterVisible={filterVisible}
                onSubmit={fetchDeviceLogFiles}
              />
            </Box>
            // <Box sx={{ pt: 2 }}>
            //   <SortableFilterTable<IDeviceLogFiles>
            //     headCells={headCells}
            //     data={filesList}
            //     path={'/app/deviceLogs/'}
            //     isFiltered={filterVisible}
            //   />
            // </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceLogFilesList;
