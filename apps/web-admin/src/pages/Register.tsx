import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Box, Button, Checkbox, Container, FormHelperText, Link, TextField, Typography } from '@material-ui/core';
// import { useMemo } from 'react';
// import { useDispatch } from 'react-redux';
// import { useTypedSelector } from '@lib/store';
import { IUserCredentials } from '@lib/types';
// import { IUserCredentials } from '@lib/types';
// import { useSelector } from 'react-redux';
// import { RootState } from '@lib/store';
// import { useState, useEffect, useMemo } from 'react';

// interface Props {
//   onSignIn: (credentials: IUserCredentials) => void;
// }

const Register = () => {
  const navigate = useNavigate();
  //const { error, loading, status } = useTypedSelector((state) => state.auth);

  // const request = useMemo(
  //   () => ({
  //     isError: error,
  //     isLoading: loading,
  //     status,
  //   }),
  //   [error, loading, status],
  // );

  // const dispatch = useDispatch();

  // const handleSignUp = useCallback(
  //   (userName: string, password: string) => dispatch(authActions.signup(userName, password)),
  //   [dispatch],
  // );

  const formik = useFormik<IUserCredentials>({
    enableReinitialize: true,
    initialValues: {
      userName: '',
      password: '',
    },
    /*   validationSchema: yup.object({
      userName: yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      password: yup.string().max(20, 'Must be 20 characters or less').required('Required'),
    }), */
    onSubmit: (values) => {
      //handleSignUp(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <Helmet>
        <title>Register | Material Kit</title>
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
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              password: '',
              policy: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              firstName: Yup.string().max(255).required('First name is required'),
              lastName: Yup.string().max(255).required('Last name is required'),
              password: Yup.string().max(255).required('password is required'),
              policy: Yup.boolean().oneOf([true], 'This field must be checked'),
            })}
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({ errors, handleBlur, handleChange, isSubmitting, touched, values }) => (
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Create new account
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="Имя пользователя"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last name"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: -1,
                  }}
                >
                  <Checkbox checked={values.policy} name="policy" onChange={handleChange} />
                  <Typography color="textSecondary" variant="body1">
                    I have read the{' '}
                    <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6">
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && <FormHelperText error>{errors.policy}</FormHelperText>}
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
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

export default Register;
