import { Box, Card, CardContent, Grid, TextField, Divider, Button, Checkbox } from '@material-ui/core';

import { useEffect, useState } from 'react';

import { INamedEntity, IUser, NewUser } from '@lib/types';
import { FormikTouched, useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';

import api from '@lib/client-api';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import ComboBox from '../ComboBox';
import companyActions from '../../store/company';
import userActions from '../../store/user';
import { useDispatch, useSelector } from '../../store';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  onSubmit: (values: IUser | NewUser) => void;
  onCancel: () => void;
}

const UserDetails = ({ user, loading, onSubmit, onCancel }: IProps) => {
  const [open, setOpen] = useState(false);
  const [userERP, setUserERP] = useState(user.appSystem ? true : false);

  // const [appSystems, setAppSystems] = useState<INamedEntity[] | undefined>([]);
  // const [loadingAppSystems, setLoadingAppSystems] = useState(true);

  // const [users, setUsers] = useState<INamedEntity[]>([]);
  // const [loadingUsers, setLoadingUsers] = useState(true);

  const { list: appSystems, loading: loadingAppSystems } = useSelector((state) => state.appSystems);
  const { list: users, loading: loadingUsers } = useSelector((state) => state.users);
  // useEffect(() => {
  //   let unmounted = false;
  //   const getCompanies = async () => {
  //     const res = await api.company.getCompanies();
  //     if (res.type === 'GET_COMPANIES' && !unmounted) {
  //       const companyAppSystems = res.companies.map((d) => ({ appSystems: d.appSystems }));
  //       setAppSystems(companyAppSystems[0].appSystems);
  //       setLoadingAppSystems(false);
  //     }
  //   };
  //   getCompanies();
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);

  // useEffect(() => {
  //   let unmounted = false;
  //   const getUsers = async () => {
  //     const res = await api.user.getUsers();
  //     if (res.type === 'GET_USERS' && !unmounted) {
  //       setUsers(res.users.filter((i) => i.appSystem).map((d) => ({ id: d.id, name: d.name })));
  //       setLoadingUsers(false);
  //     }
  //   };
  //   getUsers();
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(companyActions.fetchCompanies());
  //   dispatch(userActions.fetchUsers());
  // }, []);

  const formik = useFormik<IUser | NewUser>({
    enableReinitialize: true,
    initialValues: {
      ...user,
      name: user.name || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      middleName: user.middleName || '',
      verifyPassword: '',
      password: (user as NewUser).password || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      appSystem: (user.appSystem || null) as INamedEntity,
      erpUser: (user.erpUser || null) as INamedEntity,
      externalId: user.externalId || '',
      disabled: user.disabled || false,
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

  const handleUserERP = () => {
    userERP ? setUserERP(false) : setUserERP(true);
  };

  console.log('user.role', user.role);

  return (
    <FormikProvider value={formik}>
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
                    error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                    fullWidth
                    label="Отчество"
                    name="middleName"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="middleName"
                    disabled={loading}
                    value={formik.values.middleName}
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
                    placeholder="email@example.com"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    disabled={loading}
                    value={formik.values.email}
                  />
                </Grid>
                {userERP ? (
                  <Grid item md={6} xs={12}>
                    <Field
                      component={ComboBox}
                      name="appSystem"
                      label="Подсистема"
                      type="appSystem"
                      options={appSystems?.map((d) => ({ id: d.id, name: d.name })) || []}
                      setFieldValue={formik.setFieldValue}
                      setTouched={formik.setTouched}
                      error={Boolean(formik.touched.appSystem && formik.errors.appSystem)}
                      disabled={loading || loadingAppSystems}
                      required={userERP ? true : false}
                    />
                  </Grid>
                ) : (
                  <Grid item md={6} xs={12}>
                    <Field
                      component={ComboBox}
                      name="erpUser"
                      label="Пользователь ERP"
                      type="erpUser"
                      options={users?.map((d) => ({ id: d.id, name: d.name })) || []}
                      setFieldValue={formik.setFieldValue}
                      setTouched={formik.setTouched}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={formik.touched.erpUser && Boolean(formik.errors.erpUser)}
                      disabled={loading || loadingUsers}
                      required={userERP ? false : true}
                    />
                  </Grid>
                )}

                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.externalId && Boolean(formik.errors.externalId)}
                    fullWidth
                    required={userERP || (user.role && user.role !== 'User') ? false : true}
                    label="ID"
                    name="externalId"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="externalId"
                    disabled={loading}
                    value={formik.values.externalId}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Checkbox checked={userERP} color="primary" onChange={handleUserERP} />
                  Пользователь ERP
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    id="disabled"
                    type="checkbox"
                    name="disabled"
                    label="Неактивен"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={loading}
                    value={formik.values.disabled}
                    checked={formik.values.disabled}
                    component={Checkbox}
                  />
                  Неактивен
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
                {(formik.values as NewUser).password !== (formik.values as NewUser).verifyPassword &&
                  (formik.values as NewUser).verifyPassword && (
                    <Grid item md={6} xs={12} display={open ? 'block' : 'none'} style={{ color: 'red' }}>
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
    </FormikProvider>
  );
};

export default UserDetails;
