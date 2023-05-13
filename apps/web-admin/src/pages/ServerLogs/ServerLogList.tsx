import { Helmet } from 'react-helmet';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CachedIcon from '@material-ui/icons/Cached';
import FilterIcon from '@material-ui/icons/FilterAltOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import { IFileSystem } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IFileFilter, IHeadCells, IFilePageParam, IToolBarButton, IServerLog } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import actions from '../../store/serverLog';
import FileListTable from '../../components/file/FileListTable';
import ServerLogListTable from '../../components/serverLog/ServerLogListTable';

const ServerLogList = () => {
  const dispatch = useDispatch();

  const { list: newList, loading, errorMessage } = useSelector((state) => state.serverLogs);

  const list: IServerLog[] = [{ name: 'access' }, { name: 'combined' }, { name: 'error' }];
  // const sortedList = useMemo(() => list.sort((a, b) => (a.path < b.path ? -1 : 1)), [list]);
  const fetchServerLogs = useCallback(
    (filesFilters?: IFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchServerLogs());
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchServerLogs();
  }, [fetchServerLogs]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    // setPageParamLocal({ filterText: value });

    if (inputValue) return;

    // fetchDevices('');
  };

  const handleSearchClick = () => {
    fetchServerLogs();
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearError = () => {
    dispatch(actions.serverLogActions.clearError());
  };

  const handleClearSearch = () => {
    fetchServerLogs();
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchServerLogs(),
      icon: <CachedIcon />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Логи сервера</title>
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
            value={''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <ServerLogListTable serverLogs={list} />
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

export default ServerLogList;
