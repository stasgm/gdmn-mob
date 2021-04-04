import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography } from '@material-ui/core';
import * as yup from 'yup';

import { authActions, useTypedSelector } from '@lib/store';
import { IUserCredentials } from '@lib/types';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkDevice = useCallback(() => dispatch(authActions.checkDevice()), [dispatch]);
  const signIn = useCallback((credentials: IUserCredentials) => dispatch(authActions.signIn(credentials)), [dispatch]);

  const { error, loading, status } = useTypedSelector((state) => state.auth);

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  const formik = useFormik<IUserCredentials>({
    initialValues: {
      userName: 'Stas',
      password: '123',
    },
    validationSchema: yup.object().shape({
      userName: yup.string().required('Required'),
      password: yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      await checkDevice();
      await signIn(values);
      navigate('/app');
    },
  });

  return (
    <>
      <Helmet>
        <title>Login</title>
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
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography color="textPrimary" variant="h2">
                Sign in
              </Typography>
            </Box>
            <TextField
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              fullWidth
              helperText={formik.values.userName && formik.errors.userName}
              label="Имя пользователя"
              margin="normal"
              name="userName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="name"
              value={formik.values.userName}
              variant="outlined"
            />
            <TextField
              error={formik.touched.password && Boolean(formik.errors.password)}
              fullWidth
              helperText={formik.values.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                startIcon={''}
                disabled={request.isLoading || !!formik.errors.password || !!formik.errors.userName}
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
        </Container>
      </Box>
    </>
  );
};

export default Login;
