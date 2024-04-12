import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useNavigate } from 'react-router';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { appSystemActions } from '../../store/appSystem';
import { IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import AppSystemListTable from '../../components/appSystem/AppSystemListTable';

const AppSystemList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading, pageParams } = useSelector((state) => state.appSystems);

  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  useEffect(() => {
    dispatch(appSystemActions.setPageParam({ tab: 0 }));
  }, [dispatch]);

  const fetchAppSystems = useCallback(() => {
    dispatch(appSystemActions.fetchAppSystems(undefined, pageParams?.filterText));
  }, [dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchAppSystems();
    }
  }, [fetchAppSystems, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;

    dispatch(appSystemActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(appSystemActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(appSystemActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleSetPageParams = useCallback(
    (params: IPageParam) => {
      dispatch(
        appSystemActions.setPageParam({
          page: params.page,
          limit: params.limit,
        }),
      );
    },
    [dispatch],
  );

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchAppSystems(),
      icon: <CachedIcon />,
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
        <title>Подсистемы</title>
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
            searchTitle={'Найти подсистему'}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={filterText}
            clearOnClick={handleClearSearch}
            disabled={loading}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <AppSystemListTable appSystems={list} onSetPageParams={handleSetPageParams} pageParams={pageParams} />
          )}
        </Container>
      </Box>
    </>
  );
};

export default AppSystemList;
