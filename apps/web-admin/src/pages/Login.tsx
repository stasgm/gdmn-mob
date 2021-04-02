import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography } from '@material-ui/core';
import { IUserCredentials } from '@lib/types';
import { useSelector } from 'react-redux';
import { RootState } from '@lib/store';
import { useState, useMemo } from 'react';

interface Props {
  onSignIn: (credentials: IUserCredentials) => void;
}

const Login = ({ onSignIn }: Props) => {
  const navigate = useNavigate();
  const { error, loading, status } = useSelector((state: RootState) => state.auth);

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  const handleLogIn = () => {
    onSignIn(credential);
  };

  const [credential, setCredentials] = useState<IUserCredentials>({
    userName: 'Stas',
    password: '123',
  });

  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
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
        <Container maxWidth="sm">
          <Formik
            initialValues={credential}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({ errors, handleBlur }) => (
              <form onSubmit={handleLogIn}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(credential.userName && errors.userName)}
                  fullWidth
                  helperText={credential.userName && errors.userName}
                  label="Имя пользователя"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={(val) => setCredentials({ ...credential, userName: val.target.value })}
                  type="name"
                  value={credential.userName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(credential.password && errors.password)}
                  fullWidth
                  helperText={credential.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={(val) => setCredentials({ ...credential, password: val.target.value })}
                  type="password"
                  value={credential.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={request.isLoading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
