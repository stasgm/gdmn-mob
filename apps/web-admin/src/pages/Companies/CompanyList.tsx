import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { ICompany } from '@lib/types';

import CompanyListTable from '../../components/company/CompanyListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

import SnackBar from '../../components/SnackBar';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { list, loading, errorMessage } = useSelector((state) => state.companies);
  const [dataList, setDataList] = useState<ICompany[]>([]);

  const fetchCompanies = useCallback(async () => {
    const res = await dispatch(actions.fetchCompanies());
    if (res.type === 'COMPANY/FETCH_COMPANIES_SUCCESS') {
      //console.log(res.payload);
      setDataList(res.payload);
    }
    if (res.type === 'COMPANY/FETCH_COMPANIES_FAILURE') {
      //console.log('ошибочка', res.payload);
    }
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies();
  }, [fetchCompanies]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value.toUpperCase();

    const filtered = list.filter((item) => {
      const name = item.name.toUpperCase();

      return name.includes(inputValue);
    });

    setDataList(filtered);
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchCompanies,
      icon: <CachedIcon />,
    },
    {
      name: 'Загрузить',
      onClick: () => {
        return;
      },
      icon: <ImportExportIcon />,
    },
    {
      name: 'Выгрузить',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
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
          <ToolbarActionsWithSearch buttons={buttons} searchTitle={'Найти компанию'} updateInput={handleUpdateInput} />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <CompanyListTable companies={dataList} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default CompanyList;
