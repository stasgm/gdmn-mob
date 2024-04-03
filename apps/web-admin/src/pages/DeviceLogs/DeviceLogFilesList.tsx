import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { IDeviceLogFile } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IDeviceLogFileFilter, IDeviceLogPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import DeviceLogFilesListTable from '../../components/deviceLogs/DeviceLogFilesListTable';
import { deviceLogActions } from '../../store/deviceLog';

const DeviceLogFilesList = () => {
  const dispatch = useDispatch();

  const { fileList: filesList, loading, pageParams } = useSelector((state) => state.deviceLogs);

  const fetchDeviceLogFiles = useCallback(
    (logFilters?: IDeviceLogFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceLogActions.fetchDeviceLogFiles(logFilters, filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFiles(pageParams?.logFilters);
  }, [fetchDeviceLogFiles, pageParams?.logFilters]);

  const [pageParamLocal, setPageParamLocal] = useState<IDeviceLogPageParam | undefined>(pageParams);

  const [filterVisible, setFilterVisible] = useState(pageParams?.logFilters ? true : false);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;
  };

  const handleSearchClick = () => {
    dispatch(deviceLogActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));
    fetchDeviceLogFiles(pageParams?.logFilters ? pageParams?.logFilters : undefined, pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleSetPageParams = useCallback(
    (logPageParams: IDeviceLogPageParam) => {
      dispatch(
        deviceLogActions.setPageParam({
          logFilters: logPageParams.logFilters,
          page: logPageParams.page,
          limit: logPageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const handleFilter = useCallback(() => {
    if (filterVisible) {
      setFilterVisible(false);
      dispatch(deviceLogActions.setPageParam({ logFilters: undefined, page: 0 }));
    } else {
      setFilterVisible(true);
    }
  }, [dispatch, filterVisible]);

  const [selectedDeviceLogFileIds, setSelectedDeviceLogFileIds] = useState<IDeviceLogFile[]>([]);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceLogFileIds;

    if (event.target.checked) {
      newSelectedDeviceLogFileIds = filesList.map((deviceLogFile: any) => deviceLogFile);
    } else {
      newSelectedDeviceLogFileIds = [];
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
  };

  const handleSelectOne = (_event: any, deviceLogFile: IDeviceLogFile) => {
    const selectedIndex = selectedDeviceLogFileIds.map((item: IDeviceLogFile) => item.id).indexOf(deviceLogFile.id);

    let newSelectedDeviceLogFileIds: IDeviceLogFile[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds, deviceLogFile);
    } else if (selectedIndex === 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(1));
    } else if (selectedIndex === selectedDeviceLogFileIds.length - 1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(
        selectedDeviceLogFileIds.slice(0, selectedIndex),
        selectedDeviceLogFileIds.slice(selectedIndex + 1),
      );
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = useCallback(() => {
    setOpen(false);
    const ids = selectedDeviceLogFileIds.map((i) => {
      return {
        id: i.id,
        appSystemId: i.appSystem?.id || '',
        companyId: i.company?.id || '',
        folder: i.folder || '',
      };
    });
    if (ids) {
      dispatch(deviceLogActions.deleteDeviceLogs(ids));
      setSelectedDeviceLogFileIds([]);
    }
  }, [dispatch, selectedDeviceLogFileIds]);

  const handleClearSearch = () => {
    dispatch(deviceLogActions.setPageParam({ filterText: undefined, page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchDeviceLogFiles(pageParamLocal?.logFilters || undefined);
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
      onClick: handleFilter,
      icon: <FilterIcon />,
    },
    {
      name: 'Удалить',
      sx: { mx: 1 },
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      {/* <Helmet>
        <title>Журнал ошибок</title>
      </Helmet> */}
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить файлы?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Удалить
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
              <DeviceLogFilesListTable
                deviceLogFiles={filesList}
                isFilterVisible={filterVisible}
                onSubmit={fetchDeviceLogFiles}
                onDelete={handleDelete}
                onSelectMany={handleSelectAll}
                onSelectOne={handleSelectOne}
                selectedDeviceLogFiles={selectedDeviceLogFileIds}
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

export default DeviceLogFilesList;
