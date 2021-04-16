import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import CompanyListTable from '../../components/company/CompanyListTable';
import TopToolbar from '../../components/TopToolbar';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.companies);

  const fetchCompanies = useCallback(() => dispatch(actions.fetchCompanies()), [dispatch]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    !list?.length && fetchCompanies();
  }, [fetchCompanies, list?.length]);

  const buttons: IToolBarButton[] = [
    {
      name: 'Load',
      onClick: () => fetchCompanies(),
    },
    {
      name: 'Export',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
    },
    {
      name: ' Add company',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate(`${location.pathname}/new`),
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
          <TopToolbar buttons={buttons} />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 3 }}>
              <CompanyListTable companies={list} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CompanyList;
