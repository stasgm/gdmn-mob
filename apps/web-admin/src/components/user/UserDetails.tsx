import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IUser, NewUser } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  user: IUser | NewUser;
  onSubmit: (values: IUser | NewUser) => void;
  onCancel: () => void;
}

const UserDetails = ({ user, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<IUser | NewUser>({
    enableReinitialize: true,
    initialValues: user,
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

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
              <Grid container spacing={3} lg={8} md={6} xs={12}>
                <Grid item md={12} xs={12}>
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
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    fullWidth
                    label="Email"
                    name="phoneNumber"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="phoneNumber"
                    disabled={loading}
                    value={'test@gmail.com'}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <>
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
