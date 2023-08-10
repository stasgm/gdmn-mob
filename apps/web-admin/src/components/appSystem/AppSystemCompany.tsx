import { Helmet } from 'react-helmet';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CachedIcon from '@mui/icons-material/Cached';
import { ICompany } from '@lib/types';

import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import SortableTable from '../SortableTable';
import AppSystem from '@lib/client-api/dist/src/requests/appSystem';
import { IUser } from '@lib/types';
import { string } from 'yup';
import { IAppSystem } from '@lib/types';
import { Filter } from 'react-feather';

interface IProps {
  appSystem: IAppSystem;
}

const AppSystemCompany = ({ appSystem }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch: AppDispatch = useDispatch();
  const { list, loading, errorMessage, pageParams } = useSelector((state) => state.companies);
  const { user: authUser } = useSelector((state) => state.auth);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchCompanies = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchCompanies(appSystem.id, filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies(pageParams?.filterText);
  }, [fetchCompanies, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchCompanies('');
  };

  const handleSearchClick = () => {
    dispatch(actions.companyActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));

    fetchCompanies(pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(actions.companyActions.setPageParam({ filterText: undefined, page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchCompanies();
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleAddCompany = () => {
    if (list.length && !(authUser?.role === 'SuperAdmin')) {
      dispatch(actions.companyActions.setError('Компания уже существует'));
    } else {
      return navigate(`${location.pathname}/new`);
    }
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        actions.companyActions.setPageParam({
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

  const headCells: IHeadCells<ICompany>[] = [
    { id: 'name', label: 'Наименование', sortEnable: true },
    { id: 'id', label: 'ID', sortEnable: true },
    { id: 'admin', label: 'Администратор', sortEnable: true },
    { id: 'creationDate', label: 'Дата создания', sortEnable: true },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
    
  ];

  return (
    <>
      <Helmet>
        <title>Компании</title>
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
            searchTitle={'Найти компанию'}
            // valueRef={valueRef}
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
              <SortableTable<ICompany>
                headCells={headCells}
                data={list}
                path={'/app/companies/'}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                style={{ overflowY: 'auto', maxHeight: window.innerHeight - 268 }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AppSystemCompany;