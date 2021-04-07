import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router';

import { useEffect } from 'react';

import CompanyListResults from '../components/company/CompanyListResults';
import CompanyListToolbar from '../components/company/CompanyListToolbar';
import { useSelector } from '../store';
import companyAsyncActions from '../store/company/actions.async';

const CompanyList = () => {
  const { list } = useSelector((state) => state.companies);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальейшем надо загружать при открытии приложения */
    !list?.length && dispatch(companyAsyncActions.fetchCompanies());
  }, [dispatch, list?.length]);

  const handleLoadCompanies = () => {
    dispatch(companyAsyncActions.fetchCompanies());
  };

  const handleAddCompany = () => {
    navigate('/app/companies/new');
  };

  return (
    <>
      <Helmet>
        <title>Companies</title>
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
//companies={companies}
export default CompanyList;
