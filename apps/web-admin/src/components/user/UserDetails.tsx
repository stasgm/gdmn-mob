import { Box, Card, CardContent, Grid, TextField, Divider, Button, Checkbox } from '@material-ui/core';

import { useEffect, useState } from 'react';

import { IAppSystem, ICompany, INamedEntity, IUser, NewUser } from '@lib/types';
import { FormikTouched, useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';

import api from '@lib/client-api';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import ComboBox from '../ComboBox';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  // appSystems: IAppSystem[];
  onSubmit: (values: IUser | NewUser) => void;
  onCancel: () => void;
}

const UserDetails = ({ user, loading, /*appSystems,*/ onSubmit, onCancel }: IProps) => {
  const [open, setOpen] = useState(false);
  const [userERP, setUserERP] = useState(user.appSystem ? true : false);

  const [appSystemm, setAppSystems] = useState<INamedEntity[]>([]);
  const [loadingAppSystems, setLoadingAppSystems] = useState(true);

  const [companies, setCompanies] = useState<string[] | undefined>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [users, setUsers] = useState<INamedEntity[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    let unmounted = false;
    const getAppSystems = async () => {
      const res = await api.appSystem.getAppSystems();
      if (res.type === 'GET_APP_SYSTEMS' && !unmounted) {
        setAppSystems(res.appSystems.map((d) => ({ id: d.id, name: d.name })));
        setLoadingAppSystems(false);
      }
    };
    getAppSystems();
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    const getCompanies = async () => {
      const res = await api.company.getCompanies();
      if (res.type === 'GET_COMPANIES' && !unmounted) {
        const a = res.companies.map((d) => ({ appSystems: d.appSystems }));
        setCompanies(a[0].appSystems);
        setLoadingCompanies(false);
      }
    };
    getCompanies();
    return () => {
      unmounted = true;
    };
  }, []);

  console.log('compppp', companies);

  console.log('1234567', user.appSystem);

  const appSystems1: [] = [];

  for (const item of appSystemm) {
    if (companies?.find((i) => i === item.id)) {
      // appSystems.push(item.name);
      appSystems1.push({ id: item.id, name: item.name });
    }
  }

  console.log('new', appSystems1);

  // setAppSystems(appSystems1);

  useEffect(() => {
    let unmounted = false;
    const getUsers = async () => {
      const res = await api.user.getUsers();
      if (res.type === 'GET_USERS' && !unmounted) {
        setUsers(res.users.filter((i) => i.appSystem).map((d) => ({ id: d.id, name: d.name })));
        setLoadingUsers(false);
      }
    };
    getUsers();
    return () => {
      unmounted = true;
    };
  }, []);

  console.log('formik', users);

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
      appSystem: user.appSystem || '', // user.alias || '',
      // alias: user.alias || '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Заполните это поле'),
      password:
        Object.keys(user).length == 0 ? yup.string().required('Заполните это поле') : yup.string().notRequired(),
      verifyPassword:
        Object.keys(user).length == 0 ? yup.string().required('Заполните это поле') : yup.string().notRequired(),
    }),
    onSubmit: (values) => {
      // onSubmit({ ...values, alias: values.alias.name } as IUser);
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
                {userERP ? (
                  <Grid item md={6} xs={12}>
                    <Field
                      component={ComboBox}
                      name="appSystem"
                      label="Подсистема"
                      type="appSystem"
                      options={appSystems1?.map((d) => ({ id: d.id, name: d.name })) || []} //{appSystems || []} //+
                      setFieldValue={formik.setFieldValue}
                      setTouched={formik.setTouched}
                      error={Boolean(formik.touched.appSystem && formik.errors.appSystem)}
                      disabled={loading || loadingAppSystems}
                      // getOptionLabel={formik.values.appSystem?.name || ''}
                    />
                  </Grid>
                ) : (
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
                  //   <Grid item md={6} xs={12}>
                  //   <Field
                  //     component={ComboBox}
                  //     name="erpUser"
                  //     label="Подсистема"
                  //     type="erpUser"
                  //     options={users?.map((d) => ({ id: d.id, name: d.name })) || []} //{appSystems || []} //+
                  //     setFieldValue={formik.setFieldValue}
                  //     setTouched={formik.setTouched}
                  //     error={Boolean(formik.touched.erpUser && formik.errors.erpUser)}
                  //     disabled={loading || loadingUsers}
                  //     // getOptionLabel={formik.values.appSystem?.name || ''}
                  //   />
                  // </Grid>
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
                  {/* <TextField */}
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
                <Grid item md={6} xs={12}>
                  <Checkbox
                    checked={userERP}
                    color="primary"
                    // indeterminate={selectedDeviceIds.length > 0 && selectedDeviceIds.length < devices.length}
                    onChange={handleUserERP}
                  />
                  Пользователь ERP
                  {/* <Text>Пользователь ERP</Text> */}
                </Grid>
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
