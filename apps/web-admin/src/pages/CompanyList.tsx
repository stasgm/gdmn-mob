import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import companies from '../__mocks__/companies';

import CompanyListResults from '../components/company/CompanyListResults';
import CompanyListToolbar from '../components/company/CompanyListToolbar';

const CompanyList = () => (
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
        <CompanyListToolbar />
        <Box sx={{ pt: 3 }}>
          <CompanyListResults companys={companies} />
        </Box>
      </Container>
    </Box>
  </>
);

export default CompanyList;
