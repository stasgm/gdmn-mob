import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import CompanyListResults from '../../components/company/CompanyListResults';
import CompanyListToolbar from '../../components/company/CompanyListToolbar';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company/actions.async';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list } = useSelector((state) => state.companies);

  const fetchCompanies = useCallback(() => dispatch(actions.fetchCompanies()), [dispatch]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    !list?.length && fetchCompanies();
  }, [fetchCompanies, list?.length]);

  const handleLoadCompanies = () => fetchCompanies();

  const handleAddCompany = () => {
    navigate(`${location.pathname}/new`);
  };

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
          <CompanyListToolbar onLoadCompanies={handleLoadCompanies} onAddCompany={handleAddCompany} />
          <Box sx={{ pt: 3 }}>
            <CompanyListResults companies={list} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CompanyList;
