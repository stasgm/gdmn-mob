import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CachedIcon from '@mui/icons-material/Cached';
import { ICompany } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions } from '../../store/company';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import SortableTable from '../../components/SortableTable';

const headCells: IHeadCells<ICompany>[] = [
  { id: 'name', label: 'Наименование', sortEnable: true },
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'admin', label: 'Администратор', sortEnable: true },
  { id: 'creationDate', label: 'Дата создания', sortEnable: true },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
];

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { list, loading, pageParams } = useSelector((state) => state.companies);
  const { user: authUser } = useSelector((state) => state.auth);
  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const fetchCompanies = useCallback(() => {
    dispatch(companyActions.fetchCompanies(pageParams?.filterText));
  }, [dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchCompanies();
    }
  }, [fetchCompanies, pageParams?.filterText]);

  useEffect(() => {
    dispatch(companyActions.setPageParam({ tab: 0 }));
  }, [dispatch]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;

    dispatch(companyActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(companyActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(companyActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleAddCompany = () => {
    if (list.length && !(authUser?.role === 'SuperAdmin')) {
      dispatch(companyActions.setError('Компания уже существует'));
    } else {
      return navigate(`${location.pathname}/new`);
    }
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        companyActions.setPageParam({
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
      onClick: () => fetchCompanies(),
      icon: <CachedIcon />,
    },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: handleAddCompany,
      icon: <AddCircleOutlineIcon />,
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
            searchTitle={'Найти компанию'}
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
            <Box sx={{ pt: 2 }}>
              <SortableTable<ICompany>
                headCells={headCells}
                data={list}
                path={'/app/companies/'}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                byMaxHeight={true}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CompanyList;
