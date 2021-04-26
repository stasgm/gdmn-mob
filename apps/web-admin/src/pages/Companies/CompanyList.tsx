import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import CompanyListTable from '../../components/company/CompanyListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.companies);

  const fetchCompanies = useCallback(
    () =>
      dispatch(actions.fetchCompanies())
        .then((payload) => console.log('done', payload))
        .catch((err) => console.log(err)),
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies();
  }, [fetchCompanies]);

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
          <ToolbarActionsWithSearch buttons={buttons} searchTitle={'Найти компанию'} />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <CompanyListTable companies={list} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CompanyList;
