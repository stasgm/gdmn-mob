import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useNavigate } from 'react-router';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/appSystem';
import { IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import AppSystemListTable from '../../components/appSystem/AppSystemListTable';

const AppSystemList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading, pageParams } = useSelector((state) => state.appSystems);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchAppSystems = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchAppSystems(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchAppSystems(pageParams?.filterText);
  }, [fetchAppSystems, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;
    setPageParamLocal({ filterText: value });
    if (inputValue) return;
  };

  const handleSearchClick = () => {
    dispatch(actions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));
    fetchAppSystems(pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(actions.setPageParam({ filterText: undefined, page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchAppSystems();
  };

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
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <AppSystemListTable appSystems={list} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AppSystemList;
