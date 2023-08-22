import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Tooltip } from '@mui/material';
import { IUser } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import RefreshIcon from '@mui/icons-material/Refresh';

interface IProps {
  user: IUser;
  loading: boolean;
  onSubmit: (user: IUser) => void;
}

const AccountProfileDetails = ({ user, loading, onSubmit }: IProps) => {
  const formik = useFormik<IUser>({
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
      <Card>
        <CardHeader title="Профиль" />
        <Divider />
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
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.name}
                    variant="outlined"
                    disabled={loading}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Grid container>
                    <Box style={{ flexGrow: 1 }}>
                      <TextField
                        error={formik.touched.accessCode && Boolean(formik.errors.accessCode)}
                        fullWidth
                        label="Код доступа"
                        name="accessCode"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.accessCode}
                        variant="outlined"
                        disabled={loading}
                      />
                    </Box>
                    <Tooltip title="Сгенерировать код">
                      <Button /*onClick={() => (code, device.id)}*/>
                        <RefreshIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    fullWidth
                    label="Имя"
                    name="firstName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    variant="outlined"
                    disabled={loading}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    fullWidth
                    label="Фамилия"
                    name="lastName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    variant="outlined"
                    disabled={loading}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    fullWidth
                    label="Номер телефона"
                    name="phoneNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                    variant="outlined"
                    disabled={loading}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    fullWidth
                    label="Email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    variant="outlined"
                    disabled={loading}
                  />
                </Grid>

                {/* <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    onChange={handleChange}
                    required
                    value={values.country}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select State"
                    name="state"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.state}
                    variant="outlined"
                  >
                    {states.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid> */}
              </Grid>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <Button color="primary" variant="contained" type="submit" disabled={loading}>
                Сохранить
              </Button>
            </Box>
          </Card>
        </form>
      </Card>
    </>
  );
};

export default AccountProfileDetails;
