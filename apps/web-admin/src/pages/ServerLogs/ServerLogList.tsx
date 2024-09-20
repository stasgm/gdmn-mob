import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

import { ServerLogFile } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IHeadCells, IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { serverLogActions } from '../../store/serverLog';
import SortableTable from '../../components/SortableTable';

const headCells: IHeadCells<ServerLogFile>[] = [
  { id: 'path', label: 'Путь', sortEnable: true },
  { id: 'id', label: 'Наименование', sortEnable: true },
  { id: 'date', label: 'Дата создания', sortEnable: true },
  { id: 'mdate', label: 'Дата редактирования', sortEnable: true },
  { id: 'size', label: 'Размер', sortEnable: true },
];

const ServerLogList = () => {
  const dispatch = useDispatch();

  const { list, loading, pageParams } = useSelector((state) => state.serverLogs);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchServerLogs = useCallback(
    (filterText?: string, _fromRecord?: number, _toRecord?: number) => {
      dispatch(serverLogActions.fetchServerLogs(filterText));
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
    dispatch(serverLogActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));

    fetchServerLogs(pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(serverLogActions.setPageParam({ filterText: '', page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchServerLogs();
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        serverLogActions.setPageParam({
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
            disabled={loading}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <SortableTable<ServerLogFile>
                headCells={headCells}
                data={list}
                path={'/app/serverLogs/'}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                byMaxHeight={true}
                withCheckBox={true}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ServerLogList;
