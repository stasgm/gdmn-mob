import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IDeviceBinding, NewDeviceBinding, INamedEntity, IDevice } from '@lib/types';
import { Field, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

import { useEffect, useState } from 'react';

import api from '@lib/client-api';

import ComboBox from '../ComboBox';
import { deviceStates } from '../../utils/constants';

interface IProps {
  // devices: INamedEntity[];
  loading: boolean;
  deviceBinding: NewDeviceBinding | IDeviceBinding;
  onSubmit: (values: NewDeviceBinding | IDeviceBinding) => void;
  onCancel: () => void;
}

export interface IDeviceBindingFormik extends Omit<NewDeviceBinding | IDeviceBinding, 'state'> {
  state: INamedEntity;
}

const DeviceBindingDetails = ({ deviceBinding, loading, onSubmit, onCancel }: IProps) => {
  const [devices, setDevices] = useState<IDevice[]>();

  useEffect(() => {
    const getDevices = async () => {
      const res = await api.device.getDevices();
      if (res.type === 'GET_DEVICES') {
        setDevices(res.devices);
      }
    };
    getDevices();
  }, []);

  const initialValues: IDeviceBindingFormik = {
    ...deviceBinding,
    user: deviceBinding.user || null,
    device: deviceBinding.device || null,
    state: { id: deviceBinding.state, name: deviceStates[deviceBinding.state || 'NON-ACTIVATED'] },
  };

  const formik = useFormik<IDeviceBindingFormik>({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      user: yup.object().required('Required'),
      device: yup.object().required('Required'),
      state: yup.object().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit({ ...values, state: values.state.id } as NewDeviceBinding | IDeviceBinding);
    },
  });

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
              <Grid container direction="column" item md={6} xs={12} spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.user && formik.errors.user)}
                    fullWidth
                    label="Пользователь"
                    name="user"
                    required
                    disabled
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="user"
                    value={formik.values.user?.name}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    component={ComboBox}
                    name="device"
                    label="Устройство"
                    type="device"
                    options={devices?.map((d) => ({ id: d.id, name: d.name })) || []}
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.device && formik.errors.device)}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    component={ComboBox}
                    name="state"
                    label="Статус"
                    type="state"
                    options={Object.entries(deviceStates).map((key) => ({ id: key[0], name: key[1] })) || []}
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.state && formik.errors.state)}
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
    </FormikProvider>
  );
};

export default DeviceBindingDetails;
