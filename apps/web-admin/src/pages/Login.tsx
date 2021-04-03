import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Box, Button, Container, Link, TextField, Typography } from '@material-ui/core';
import { IUserCredentials } from '@lib/types';
// import { useSelector } from 'react-redux';
import yup from 'yup';
import { useTypedSelector } from '@lib/store';
import { useMemo } from 'react';

interface Props {
  onSignIn: (credentials: IUserCredentials) => void;
}

/* const validate = (values: IUserCredentials) => {
  const errors = {};
  if (!values.userName) {
    errors.userName = 'Required';

  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};
 */
const Login = ({ onSignIn }: Props) => {
  // const navigate = useNavigate();
  const { error, loading, status } = useTypedSelector((state) => state.auth);

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  /*   const [credential, setCredentials] = useState<IUserCredentials>({
      userName: 'Stas',
      password: '123',
    });
   */

  const formik = useFormik<IUserCredentials>({
    initialValues: {
      userName: 'Stas',
      password: '123',
    },
    /*   validationSchema: yup.object({
      userName: yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      password: yup.string().max(20, 'Must be 20 characters or less').required('Required'),
    }), */
    onSubmit: (values) => {
      onSignIn(values);
      alert(JSON.stringify(values, null, 2));
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
              error={Boolean(formik.values.userName && formik.errors.userName)}
              fullWidth
              helperText={formik.values.userName && formik.errors.userName}
              label="Имя пользователя"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="name"
              value={formik.values.userName}
              variant="outlined"
            />
            {formik.touched.userName && formik.errors.userName ? <div>{formik.errors.userName}</div> : null}
            <TextField
              error={Boolean(formik.values.password && formik.errors.password)}
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
        </Container>
      </Box>
    </>
  );
};

export default Login;
