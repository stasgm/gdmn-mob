import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IDevice, INamedEntity } from '@lib/types';
import { useFormik, FormikProvider, Field } from 'formik';
import * as yup from 'yup';

import { useEffect, useState } from 'react';

import api from '@lib/client-api';

import ComboBox from '../ComboBox';

import { deviceStates } from '../../utils/constants';

interface IProps {
  loading: boolean;
  device: IDevice;
  onSubmit: (values: IDevice) => void;
  onCancel: () => void;
}

export interface IDeviceFormik extends Omit<IDevice, 'state'> {
  state: INamedEntity;
}

const DeviceDetails = ({ device, loading, onSubmit, onCancel }: IProps) => {
  const [devices, setDevices] = useState<INamedEntity[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    let unmounted = false;
    const getDevices = async () => {
      const res = await api.device.getDevices();
      if (res.type === 'GET_DEVICES' && !unmounted) {
        setDevices(res.devices.map((d) => ({ id: d.id, name: d.name })));
        setLoadingDevices(false);
      }
    };
    getDevices();
    return () => {
      unmounted = true;
    };
  }, []);

  const initialValues: IDeviceFormik = {
    ...device,
    // user: deviceBinding.user || null,
    // device: deviceBinding.device || null,
    state: { id: device.state, name: deviceStates[device.state] },
  };

  const formik = useFormik<IDeviceFormik>({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
      state: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      console.log(values);
      onSubmit({ ...values, state: values.state.id } as IDevice); /*(values);*/
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
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    fullWidth
                    label="Наименование устройства"
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
                  <Field
                    component={ComboBox}
                    name="state"
                    label="Статус"
                    type="state"
                    options={Object.entries(deviceStates).map((key) => ({ id: key[0], name: key[1] })) || []} //+
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.state && formik.errors.state)}
                    disabled={loading}
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

export default DeviceDetails;
