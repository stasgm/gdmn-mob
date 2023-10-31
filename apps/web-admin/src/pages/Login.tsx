import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography, CircularProgress } from '@mui/material';
import * as yup from 'yup';

import { IUserCredentials } from '@lib/types';

import { useEffect, useRef, useState } from 'react';

import { authActions, useSelector, useDispatch, useAuthThunkDispatch } from '@lib/store';

import Reaptcha from 'reaptcha';

import Logo from '../components/Logo';

import { adminPath } from '../utils/constants';

import { webRequest } from '../store/webRequest';

const Login = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const { error, loading, status, errorMessage, config } = useSelector((state) => state.auth);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);
  const withCaptcha = config.protocol.toLowerCase().includes('https');
  const formik = useFormik<IUserCredentials>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Заполните это поле'),
      password: yup.string().required('Заполните это поле'),
    }),
    onSubmit: (values: IUserCredentials) => {
      authDispatch(authActions.login(webRequest(dispatch, authActions), values));
    },
  });

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

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
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-end' }}>
              <Typography color="textPrimary" variant="h4">
                Вход
              </Typography>
              {loading && <CircularProgress size={20} sx={{ mx: 2 }} />}
              {(error || !!errorMessage) && (
                <Typography color="error" variant="h5" sx={{ flexGrow: 1, textAlign: 'end' }}>
                  {errorMessage || status}
                </Typography>
              )}
            </Box>
            <TextField
              error={formik.touched.name && Boolean(formik.errors.name)}
              fullWidth
              helperText={formik.values.name && formik.errors.name}
              label="Учетная запись"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="name"
              value={formik.values.name}
              variant="outlined"
              disabled={loading}
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
              disabled={loading}
              autoComplete="new-password"
            />
            {withCaptcha && !!process.env.REACT_APP_SITE_KEY && (
              <Box
                sx={{
                  marginTop: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Reaptcha
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  ref={captchaRef}
                  onVerify={(token) => setCaptchaToken(token)}
                />
              </Box>
            )}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loading || !!formik.errors.password || !!formik.errors.name || (!captchaToken && withCaptcha)}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                <Typography>Войти</Typography>
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Ещё не с нами?{' '}
              <Link component={RouterLink} to={`${adminPath}/register`} variant="h6">
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
