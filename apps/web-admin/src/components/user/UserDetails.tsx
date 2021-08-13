import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { adminPath } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';

import { IUser, NewUser } from '@lib/types';
import { FormikTouched, useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  onSubmit: (values: IUser | NewUser) => void;
  onCancel: () => void;
  onChange: () => void;
}

const UserDetails = ({ user, loading, onSubmit, onCancel, onChange }: IProps) => {
  const navigate = useNavigate();

  const formik = useFormik<IUser | NewUser>({
    enableReinitialize: true,
    initialValues: {
      ...user,
      name: user.name || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: (user as NewUser).password || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      alias: user.alias || '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Заполните это поле'),
      password:
        Object.keys(user).length == 0 ? yup.string().required('Заполните это поле') : yup.string().notRequired(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  // const handleEdit = () => {

  //   navigate(`${adminPath}/app/users/${user.id}/edit/password`);
  // };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    fullWidth
                    label="Пользователь"
                    name="name"
                    required
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="name"
                    disabled={loading}
                    value={formik.values.name}
                  />
                </Grid>
                {Object.keys(user).length == 0 && (
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={
                        (formik.touched as FormikTouched<NewUser>).password &&
                        Boolean((formik.errors as NewUser).password)
                      }
                      fullWidth
                      required
                      label="Пароль"
                      name="password"
                      variant="outlined"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="password"
                      disabled={loading}
                      value={(formik.values as NewUser).password}
                    />
                  </Grid>
                )}
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    fullWidth
                    label="Имя"
                    name="firstName"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="firstName"
                    disabled={loading}
                    value={formik.values.firstName}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    fullWidth
                    label="Фамилия"
                    name="lastName"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="lastName"
                    disabled={loading}
                    value={formik.values.lastName}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    fullWidth
                    label="Телефон"
                    name="phoneNumber"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="phoneNumber"
                    disabled={loading}
                    value={formik.values.phoneNumber}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    disabled={loading}
                    value={formik.values.email}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.alias && Boolean(formik.errors.alias)}
                    fullWidth
                    label="Alias"
                    name="alias"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="alias"
                    disabled={loading}
                    value={formik.values.alias}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <>
              <Button
                color="primary"
                disabled={loading}
                // onClick={() => onChange()}
                onClick={onChange}
                variant="contained"
                sx={{ m: 1 }}
              >
                Сменить пароль
              </Button>
              <Button color="primary" disabled={loading} type="submit" variant="contained" sx={{ m: 1 }}>
                Сохранить
              </Button>
              <Button color="secondary" variant="contained" onClick={onCancel} disabled={loading}>
                Отмена
              </Button>
            </>
          </Card>
        </form>
      </Box>
    </>
  );
};

export default UserDetails;
