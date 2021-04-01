import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

import users from '../__mocks__/users';

import UserListResults from '../components/user/UserListResults';
import UserListToolbar from '../components/user/UserListToolbar';

const UserList = () => (
  <>
    <Helmet>
      <title>users | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <UserListToolbar />
        <Box sx={{ pt: 3 }}>
          <UserListResults users={users} />
        </Box>
      </Container>
    </Box>
  </>
);

export default UserList;
