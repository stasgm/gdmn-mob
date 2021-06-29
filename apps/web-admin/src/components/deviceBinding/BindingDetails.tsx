import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IDeviceBinding, NewDeviceBinding } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  deviceBinding: NewDeviceBinding | IDeviceBinding;
  onSubmit: (values: IDeviceBinding | NewDeviceBinding) => void;
  onCancel: () => void;
}

const BindingDetails = ({ deviceBinding, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<IDeviceBinding | NewDeviceBinding>({
    enableReinitialize: true,
    initialValues: deviceBinding,
    validationSchema: yup.object().shape({
      user: yup.string().required('Required'),
      device: yup.string().required('Required'),
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
                    error={formik.touched.user?.name && Boolean(formik.errors.user?.name)}
                    fullWidth
                    label="Пользователь"
                    name="user"
                    required
                    disabled
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="user"
                    value={formik.values.user.name}
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

export default BindingDetails;
