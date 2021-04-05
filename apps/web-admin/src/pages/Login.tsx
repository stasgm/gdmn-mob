import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography, CircularProgress } from '@material-ui/core';
import * as yup from 'yup';

import { authActions, useTypedSelector } from '@lib/store';
import { IUserCredentials } from '@lib/types';

import Logo from '../components/Logo';

const Login = () => {
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
      checkDevice();
      signIn(values);
    },
  });

  return (
    <>
      <Helmet>
        <title>Вход в систему</title>
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
        <Container
          maxWidth="xs"
          sx={{
            py: 2,
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Logo />
            <Typography color="textPrimary" variant="h4">
              GDMN-MOBILE
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography color="textPrimary" variant="h4">
                Вход
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
              label="Пароль"
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
                disabled={request.isLoading || !!formik.errors.password || !!formik.errors.userName}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {request.isLoading && <CircularProgress size={20} />} <Typography>Войти</Typography>
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Ещё не с нами?{' '}
              <Link component={RouterLink} to="/register" variant="h6">
                Зарегистрироваться
              </Link>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
