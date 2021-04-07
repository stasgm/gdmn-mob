import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { useDispatch } from 'react-redux';

// import { companies } from '@lib/mock';

import { useNavigate } from 'react-router';

import CompanyListResults from '../components/company/CompanyListResults';
import CompanyListToolbar from '../components/company/CompanyListToolbar';
import useCompanyTypedSelectors from '../store/useCompanyTypedSelectors';
import companyAsyncActions from '../store/company/actions.async';

const CompanyList = () => {
  const { companyData } = useCompanyTypedSelectors((state) => state.company);
  const navigate = useNavigate();

  // const companyData = companies;
  console.log(companyData);

  // const { docData, loading } = useSelector((state: IAppState) => state.docs);

  const dispatch = useDispatch();

  const handleLoadCompanies = () => {
    dispatch(companyAsyncActions.fetchCompanies());
  };

  const handleAddCompany = () => {
    navigate('/app/companies/new');
  };

  const handleOpenCompany = () => {
    navigate('/app/companies/123');
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
          <CompanyListToolbar
            onLoadCompanies={handleLoadCompanies}
            onAddCompany={handleAddCompany}
            onOpenCompany={handleOpenCompany}
          />
          <Box sx={{ pt: 3 }}>
            <CompanyListResults companies={companyData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
//companies={companies}
export default CompanyList;
