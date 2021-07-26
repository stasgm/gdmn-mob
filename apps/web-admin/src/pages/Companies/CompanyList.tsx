import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
// import ImportExportIcon from '@material-ui/icons/ImportExport';

import { ICompany } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IHeadCells, IToolBarButton } from '../../types';

import SnackBar from '../../components/SnackBar';
import SortableTable from '../../components/SortableTable';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { list, loading, errorMessage } = useSelector((state) => state.companies);

  const fetchCompanies = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchCompanies(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies();
  }, [fetchCompanies]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    if (inputValue) return;

    fetchCompanies('');
  };

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchCompanies(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    const inputValue = valueRef?.current?.value;

    fetchCompanies(inputValue);
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchCompanies(),
      icon: <CachedIcon />,
    },
    // {
    //   name: 'Загрузить',
    //   onClick: () => {
    //     return;
    //   },
    //   icon: <ImportExportIcon />,
    // },
    // {
    //   name: 'Выгрузить',
    //   sx: { mx: 1 },
    //   onClick: () => {
    //     return;
    //   },
    // },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate(`${location.pathname}/new`),
      icon: <AddCircleOutlineIcon />,
    },
  ];

  const headCells: IHeadCells<ICompany>[] = [
    { id: 'name', label: 'Наименование', sortEnable: true },
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
            valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <SortableTable<ICompany> headCells={headCells} data={list} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default CompanyList;
