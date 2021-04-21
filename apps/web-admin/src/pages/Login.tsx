import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography, CircularProgress } from '@material-ui/core';
import * as yup from 'yup';

import { authActions, useSelector } from '@lib/store';
import { IUserCredentials } from '@lib/types';

import Logo from '../components/Logo';

const Login = () => {
  const dispatch = useDispatch();

  const { error, loading, status } = useSelector((state) => state.auth);

  const formik = useFormik<IUserCredentials>({
    enableReinitialize: true,
    initialValues: {
      name: 'Stas',
      password: '@123!',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
      password: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(authActions.signInWithDevice(values));
    },
  });

  // useEffect(() => {
  //   if (device && !error) {
  //     dispatch(authActions.signIn(formik.values));
  //   }
  // }, [device, error, formik.values, dispatch]);

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
              {error && (
                <Typography color="error" variant="h5" sx={{ flexGrow: 1, textAlign: 'end' }}>
                  {status}
                </Typography>
              )}
            </Box>
            <TextField
              error={formik.touched.name && Boolean(formik.errors.name)}
              fullWidth
              helperText={formik.values.name && formik.errors.name}
              label="Имя пользователя"
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
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loading || !!formik.errors.password || !!formik.errors.name}
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
