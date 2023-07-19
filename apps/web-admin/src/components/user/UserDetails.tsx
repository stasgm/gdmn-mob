import { Box, Card, CardContent, Grid, TextField, Divider, Button, Checkbox } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { INamedEntity, IUser, IUserCredentials, NewUser } from '@lib/types';
import { FormikTouched, useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import ComboBox from '../ComboBox';
import { useSelector } from '../../store';
import { validPassword } from '../../utils/constants';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  onSubmit: (values: IUser | NewUser) => void;
  onSubmitAdmin?: (values: IUserCredentials) => void;
  onCancel: () => void;
}

const UserDetails = ({ user, loading, onSubmit, onSubmitAdmin, onCancel }: IProps) => {
  const [open, setOpen] = useState(false);
  const [userERP, setUserERP] = useState(user.appSystem ? true : false);

  const [isAdmin, setIsAdmin] = useState(user.role === 'Admin');

  const { list: companies, loading: loadingСompanies } = useSelector((state) => state.companies);
  const { list: users, loading: loadingUsers } = useSelector((state) => state.users);

  const { user: authUser } = useSelector((state) => state.auth);
  const formik = useFormik<IUser | NewUser | IUserCredentials>({
    enableReinitialize: true,
    initialValues: isAdmin
      ? {
          ...user,
          name: user.name || '',
          email: user.email || '',
          password: (user as NewUser).password || '',
          verifyPassword: '',
        }
      : {
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
          company: (user.company || null) as INamedEntity,
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
      isAdmin
        ? onSubmitAdmin &&
          onSubmitAdmin({ ...values, name: values.name.trim(), password: (values as IUserCredentials).password.trim() })
        : onSubmit({
            ...values,
            name: values.name.trim(),
            firstName: (values as IUser | NewUser).firstName?.trim(),
            lastName: (values as IUser | NewUser).lastName?.trim(),
            middleName: (values as IUser | NewUser).middleName?.trim(),
            phoneNumber: (values as IUser | NewUser).phoneNumber?.trim(),
            email: (values as IUser | NewUser).email?.trim(),
            externalId: (values as IUser | NewUser).externalId?.trim(),
          } as IUser | NewUser);
    },
  });
  const appSystems =
    authUser?.role === 'SuperAdmin'
      ? companies?.find((i) => i.id === (formik.values as NewUser | IUser).company?.id)?.appSystems || []
      : companies?.map((d) => ({ appSystems: d.appSystems }))?.[0]?.appSystems;

  const erpUsers = useMemo(() => {
    return users?.filter((i) => i.appSystem).map((d) => ({ id: d.id, name: d.name }));
  }, [users]);

  const companyList = companies?.map((d) => ({ id: d.id, name: d.name }));

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

  const passwordCondition =
    !validPassword.test((formik.values as NewUser | IUserCredentials).password) &&
    open &&
    (isAdmin || (user.role && user.role !== 'User'));

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
                {authUser?.role === 'SuperAdmin' && user.role !== 'User' && (
                  <>
                    <Grid item md={isAdmin ? 12 : 6} xs={12}>
                      <Checkbox
                        checked={isAdmin}
                        color="primary"
                        onChange={() => setIsAdmin(!isAdmin)}
                        disabled={user.role === 'Admin'}
                      />
                      Администратор
                    </Grid>
                    {!isAdmin && (
                      <Grid item md={6} xs={12}>
                        <Field
                          component={ComboBox}
                          name="company"
                          label="Компания"
                          type="company"
                          options={companyList || []}
                          setFieldValue={formik.setFieldValue}
                          setTouched={formik.setTouched}
                          error={Boolean(
                            (formik.touched as FormikTouched<NewUser | IUser>).company &&
                              (formik.errors as IUser | NewUser).company,
                          )}
                          disabled={loading || loadingСompanies}
                          required={authUser.role === 'SuperAdmin'}
                        />
                      </Grid>
                    )}
                  </>
                )}

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
                {!isAdmin && (
                  <>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={
                          (formik.touched as FormikTouched<NewUser | IUser>).lastName &&
                          Boolean((formik.errors as FormikTouched<NewUser | IUser>).lastName)
                        }
                        fullWidth
                        label="Фамилия"
                        name="lastName"
                        variant="outlined"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="lastName"
                        disabled={loading}
                        value={(formik.values as IUser | NewUser).lastName}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={
                          (formik.touched as FormikTouched<NewUser | IUser>).firstName &&
                          Boolean((formik.errors as FormikTouched<NewUser | IUser>).firstName)
                        }
                        fullWidth
                        label="Имя"
                        name="firstName"
                        variant="outlined"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="firstName"
                        disabled={loading}
                        value={(formik.values as IUser | NewUser).firstName}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={
                          (formik.touched as FormikTouched<NewUser | IUser>).middleName &&
                          Boolean((formik.errors as FormikTouched<NewUser | IUser>).middleName)
                        }
                        fullWidth
                        label="Отчество"
                        name="middleName"
                        variant="outlined"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="middleName"
                        disabled={loading}
                        value={(formik.values as IUser | NewUser).middleName}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={
                          (formik.touched as FormikTouched<NewUser | IUser>).phoneNumber &&
                          Boolean((formik.errors as FormikTouched<NewUser | IUser>).phoneNumber)
                        }
                        fullWidth
                        label="Телефон"
                        name="phoneNumber"
                        variant="outlined"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="phoneNumber"
                        disabled={loading}
                        value={(formik.values as IUser | NewUser).phoneNumber}
                      />
                    </Grid>
                  </>
                )}
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
                {!isAdmin && (
                  <>
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
                          error={Boolean(
                            (formik.touched as FormikTouched<NewUser | IUser>).appSystem &&
                              (formik.errors as FormikTouched<NewUser | IUser>).appSystem,
                          )}
                          disabled={
                            (authUser?.role === 'SuperAdmin' && !(formik.values as NewUser | IUser).company) ||
                            loading ||
                            loadingСompanies
                          }
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
                          options={erpUsers || []}
                          setFieldValue={formik.setFieldValue}
                          setTouched={formik.setTouched}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={
                            (formik.touched as FormikTouched<NewUser | IUser>).erpUser &&
                            Boolean((formik.errors as FormikTouched<NewUser | IUser>).erpUser)
                          }
                          disabled={
                            (authUser?.role === 'SuperAdmin' && !(formik.values as NewUser | IUser).company) ||
                            loading ||
                            loadingUsers
                          }
                          required={userERP || user.role === 'Admin' || user.role === 'SuperAdmin' ? false : true}
                        />
                      </Grid>
                    )}
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={
                          (formik.touched as FormikTouched<NewUser | IUser>).externalId &&
                          Boolean((formik.errors as FormikTouched<NewUser | IUser>).externalId)
                        }
                        fullWidth
                        required={userERP || (user.role && user.role !== 'User') || isAdmin ? false : true}
                        label="ID из ERP системы"
                        name="externalId"
                        variant="outlined"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="externalId"
                        disabled={loading}
                        value={(formik.values as IUser | NewUser).externalId}
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
                        value={(formik.values as IUser | NewUser).disabled}
                        checked={(formik.values as IUser | NewUser).disabled}
                        component={Checkbox}
                      />
                      Неактивен
                    </Grid>
                  </>
                )}
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
                    value={(formik.values as NewUser | IUserCredentials).password.trim()}
                    autoComplete="new-password"
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
                    value={(formik.values as NewUser | IUserCredentials).verifyPassword?.trim()}
                    autoComplete="new-password"
                  />
                </Grid>
                {passwordCondition && (
                  <Grid item md={6} xs={12} display={open ? 'block' : 'none'} style={{ color: 'GrayText' }}>
                    Пароль должен содержать не менее восьми знаков, включать буквы (заглавные и строчные), цифры и
                    специальные символы
                  </Grid>
                )}
                {(formik.values as NewUser | IUserCredentials).password !==
                  (formik.values as NewUser | IUserCredentials).verifyPassword &&
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
                    loading ||
                    (formik.values as NewUser).verifyPassword !== (formik.values as NewUser).password ||
                    (!validPassword.test((formik.values as NewUser).password) &&
                      Boolean((formik.values as NewUser).password) &&
                      (user.role === 'Admin' || user.role === 'SuperAdmin'))
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
              </Grid>
            </>
          </Card>
        </form>
      </Box>
    </FormikProvider>
  );
};

export default UserDetails;
