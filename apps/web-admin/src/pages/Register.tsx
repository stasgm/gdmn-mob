import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography, CircularProgress } from '@material-ui/core';
import { IUserCredentials } from '@lib/types';

import { useEffect } from 'react';

import { authActions, useSelector, useDispatch } from '@lib/store';

import Logo from '../components/Logo';

const Register = () => {
  const navigate = useNavigate();

  const { error, loading, status } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = async (values: IUserCredentials) => {
    const res = await dispatch(authActions.signUp(values));
    if (res.type === 'AUTH/SIGNUP_SUCCCES') {
      navigate('/login');
    }
  };

  useEffect(() => {
    // dispatch(authActions.authActions.clearError());
  }, [dispatch]);

  const formik = useFormik<IUserCredentials>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Заполните это поле'),
      password: yup.string().required('Заполните это поле'),
    }),
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <>
      <Helmet>
        <title>Регистрация</title>
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
                Регистрация
              </Typography>
              {loading && <CircularProgress size={20} sx={{ mx: 2 }} />}
              {error && (
                <Typography color="error" variant="h5" sx={{ flexGrow: 1, textAlign: 'end' }}>
                  {status}
                </Typography>
              )}
            </Box>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              required
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Учетная запись"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
            />
            {/* <TextField
              error={Boolean(formik.touched.firstName && formik.errors.firstName)}
              fullWidth
              helperText={formik.touched.firstName && formik.errors.firstName}
              label="Имя"
              margin="normal"
              name="firstName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.firstName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
              fullWidth
              helperText={formik.touched.lastName && formik.errors.lastName}
              label="Фамилия"
              margin="normal"
              name="lastName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            /> */}
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              required
              label="Пароль"
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            {/* <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1,
              }}
            >
              <Checkbox checked={formik.formik.values.policy} name="policy" onChange={formik.handleChange} />
              <Typography color="textSecondary" variant="body1">
                I have read the{' '}
                <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6">
                  Terms and Conditions
                </Link>
              </Typography>
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>{formik.errors.policy}</FormHelperText>
            )} */}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loading || !!formik.errors.password || !!formik.errors.name}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Зарегистрироваться
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Зарегистрированы?{' '}
              <Link component={RouterLink} to="/login" variant="h6">
                Войти
              </Link>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
