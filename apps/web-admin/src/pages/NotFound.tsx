import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@mui/material';

const NotFound = () => (
  <>
    <Helmet>
      <title>404 | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h1">
          404: The page you are looking for isn’t here
        </Typography>
      </Container>
    </Box>
  </>
);

export default NotFound;
