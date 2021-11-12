import { Box, Card, CardContent, Grid, TextField, Divider, Button, IconButton } from '@material-ui/core';

import { useEffect, useState } from 'react';

import { IUser, NewUser } from '@lib/types';
import { FormikTouched, useFormik } from 'formik';
import * as yup from 'yup';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import NoEncryptionOutlinedIcon from '@material-ui/icons/NoEncryptionOutlined';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  onSubmit: (values: IUser | NewUser) => void;
  onCancel: () => void;
}

const UserDetails = ({ user, loading, onSubmit, onCancel }: IProps) => {
  const [open, setOpen] = useState(false);

  const formik = useFormik<IUser | NewUser>({
    enableReinitialize: true,
    initialValues: {
      ...user,
      name: user.name || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      verifyPassword: '',
      password: (user as NewUser).password || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      alias: user.alias || '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Заполните это поле'),
      password:
        Object.keys(user).length == 0 ? yup.string().required('Заполните это поле') : yup.string().notRequired(),
      verifyPassword:
        Object.keys(user).length == 0 ? yup.string().required('Заполните это поле') : yup.string().notRequired(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (Object.keys(user).length == 0) {
      setOpen(true);
    }
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClickClose = () => {
  //   setOpen(false);
  //   formik.values.password = '';
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
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.alias && Boolean(formik.errors.alias)}
                    fullWidth
                    label="Пользователь ERP"
                    name="alias"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="alias"
                    disabled={loading}
                    value={formik.values.alias}
                  />
                </Grid>
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
                <Grid item md={6} xs={12} display={open ? 'block' : 'none'}>
                  <TextField
                    error={
                      (formik.touched as FormikTouched<NewUser>).password &&
                      Boolean((formik.errors as NewUser).password)
                    }
                    fullWidth
                    required={'true' && Boolean(open)}
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
                <Grid item md={6} xs={12} display={open ? 'block' : 'none'}>
                  <TextField
                    error={
                      (formik.touched as FormikTouched<NewUser>).verifyPassword &&
                      Boolean((formik.errors as NewUser).verifyPassword)
                    }
                    fullWidth
                    required={'true' && Boolean(open)}
                    label="Повторите пароль"
                    name="verifyPassword"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    disabled={loading}
                    value={(formik.values as NewUser).verifyPassword}
                  />
                </Grid>
                {(formik.values as NewUser).password !== (formik.values as NewUser).verifyPassword && (
                  <Grid item md={6} xs={12} display={open ? 'block' : 'none'}>
                    Пароли не совпадают
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <Divider />
            <>
              <Grid container>
                <Button
                  color="primary"
                  disabled={
                    loading || (formik.values as NewUser).verifyPassword !== (formik.values as NewUser).password
                  }
                  type="submit"
                  variant="contained"
                  sx={{ m: 1 }}
                >
                  Сохранить
                </Button>
                <Button color="secondary" variant="contained" sx={{ m: 1 }} onClick={onCancel} disabled={loading}>
                  Отмена
                </Button>
                <Grid display={open ? 'none' : 'block'}>
                  {Object.keys(user).length != 0 && (
                    <Button color="primary" disabled={loading} onClick={handleClickOpen} sx={{ m: 1 }}>
                      <LockOutlinedIcon style={{ height: 18 }} /> Сменить пароль
                    </Button>
                  )}
                </Grid>
                {/* <Grid display={open ? 'block' : 'none'}>
                  {Object.keys(user).length != 0 && (
                    <Button color="primary" disabled={loading} onClick={handleClickClose} sx={{ m: 1 }}>
                      <NoEncryptionOutlinedIcon style={{ height: 18 }} /> Отменить смену пароля
                    </Button>
                  )}
                </Grid> */}
              </Grid>
            </>
          </Card>
        </form>
      </Box>
    </>
  );
};

export default UserDetails;
