import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IUser, NewUser } from '@lib/types';
import { FormikTouched, useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  user: IUser;
  onSubmit: (values: IUser) => void;
  onCancel: () => void;
}

const UserPasswordDetails = ({ user, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<IUser>({
    enableReinitialize: true,
    initialValues: {
      ...user,
      name: user.name || '',
      password: user.password || '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Заполните это поле'),
      password: yup.string().required('Заполните это поле'),
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
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    fullWidth
                    required
                    label="Пароль"
                    name="password"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    disabled={loading}
                    value={formik.values.password}
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

export default UserPasswordDetails;
