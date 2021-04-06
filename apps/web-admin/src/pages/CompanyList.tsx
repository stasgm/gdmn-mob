import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import { useDispatch } from 'react-redux';

// import { companies } from '@lib/mock';

import CompanyListResults from '../components/company/CompanyListResults';
import CompanyListToolbar from '../components/company/CompanyListToolbar';
import useCompanyTypedSelectors from '../store/useCompanyTypedSelectors';
import companyAsyncActions from '../store/company/actions.async';

const CompanyList = () => {
  const { companyData } = useCompanyTypedSelectors((state) => state.companies);
  // const companyData = companies;
  console.log(companyData);

  // const { docData, loading } = useSelector((state: IAppState) => state.docs);

  const dispatch = useDispatch();

  const handleLoadCompanies = () => {
    dispatch(companyAsyncActions.fetchCompanies());
  };

  return (
    <>
      <Helmet>
        <title>companys | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <CompanyListToolbar onLoadCompanies={handleLoadCompanies} />
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
