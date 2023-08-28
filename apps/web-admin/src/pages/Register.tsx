import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { IUserCredentials } from '@lib/types';

import React, { useEffect, useRef, useState } from 'react';

import { authActions, useAuthThunkDispatch, useSelector } from '@lib/store';

import Reaptcha from 'reaptcha';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import Logo from '../components/Logo';

import { adminPath, hostName, validPassword } from '../utils/constants';
import { webRequest } from '../store/webRequest';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAuthThunkDispatch();
  const { error, loading, status, config } = useSelector((state) => state.auth);
  const withCaptcha = config.server === hostName;

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };
  const [showVerifyPassword, setShowVerifyPassword] = React.useState(false);
  const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show);

  const handleMouseDownVerifyPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };
  const handleSubmit = async (values: IUserCredentials) => {
    const res = await dispatch(authActions.signup(webRequest(dispatch, authActions), values));

    if (res.type === 'AUTH/SIGNUP_SUCCESS') {
      navigate(`${adminPath}/login`);
    }
  };

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  const formik = useFormik<IUserCredentials>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      email: '',
      password: '',
      verifyPassword: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Заполните это поле'),
      password: yup.string().required('Заполните это поле'),
      verifyPassword: yup.string().required('Заполните это поле'),
    }),
    // onSubmit: (values) => handleSubmit(values),
    onSubmit: (values) =>
      handleSubmit({
        ...values,
        name: values.name.trim(),
        password: values.password.trim(),
      }),
  });

  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);

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
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              placeholder="example@example.com"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
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
              value={formik.values.password}
              variant="outlined"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={Boolean(formik.touched.verifyPassword && formik.errors.verifyPassword)}
              required
              label="Повторите пароль"
              fullWidth
              helperText={formik.touched.verifyPassword && formik.errors.verifyPassword}
              margin="normal"
              name="verifyPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.verifyPassword}
              variant="outlined"
              autoComplete="new-password"
              type={showVerifyPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowVerifyPassword}
                      onMouseDown={handleMouseDownVerifyPassword}
                    >
                      {showVerifyPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box style={{ color: 'GrayText' }}>
              Пароль должен содержать не менее восьми знаков, включать буквы (заглавные и строчные), цифры и специальные
              символы
            </Box>
            {formik.values.password !== formik.values.verifyPassword && formik.values.verifyPassword && (
              <Box style={{ color: 'red' }}>Пароли не совпадают</Box>
            )}
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
                disabled={
                  loading ||
                  !!formik.errors.password ||
                  !!formik.errors.name ||
                  !!formik.errors.verifyPassword ||
                  formik.values.password !== formik.values.verifyPassword ||
                  (!captchaToken && withCaptcha) ||
                  !validPassword.test(formik.values.password)
                }
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
              <Link component={RouterLink} to={`${adminPath}/login`} variant="h6">
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
