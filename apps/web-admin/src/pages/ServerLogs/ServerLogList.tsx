import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IFileFilter, IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import actions from '../../store/serverLog';

import ServerLogListTable from '../../components/serverLog/ServerLogListTable';

const ServerLogList = () => {
  const dispatch = useDispatch();

  const { list, loading, errorMessage, pageParams } = useSelector((state) => state.serverLogs);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchServerLogs = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchServerLogs(filterText));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchServerLogs(pageParams?.filterText);
  }, [fetchServerLogs, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchServerLogs('');
  };

  const handleSearchClick = () => {
    dispatch(actions.serverLogActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));

    fetchServerLogs(pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearError = () => {
    dispatch(actions.serverLogActions.clearError());
  };

  const handleClearSearch = () => {
    dispatch(actions.serverLogActions.setPageParam({ filterText: undefined, page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchServerLogs();
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        actions.serverLogActions.setPageParam({
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
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <ServerLogListTable serverLogs={list} onSetPageParams={handleSetPageParams} pageParams={pageParams} />
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
