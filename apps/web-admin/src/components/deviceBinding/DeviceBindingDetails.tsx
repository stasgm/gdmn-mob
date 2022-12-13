import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IDeviceBinding, INamedEntity } from '@lib/types';
import { Field, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

import { useEffect } from 'react';

import ComboBox from '../ComboBox';
import { deviceStates } from '../../utils/constants';
import { useDispatch, useSelector } from '../../store';
import deviceActions from '../../store/device';

interface IProps {
  loading: boolean;
  deviceBinding: IDeviceBinding;
  onSubmit: (values: IDeviceBinding) => void;
  onCancel: () => void;
}

export interface IDeviceBindingFormik extends Omit<IDeviceBinding, 'state'> {
  state: INamedEntity;
}

const DeviceBindingDetails = ({ deviceBinding, loading, onSubmit, onCancel }: IProps) => {
  // const [devices, setDevices] = useState<INamedEntity[]>([]);
  const { list: devices, loading: loadingDevices } = useSelector((state) => state.devices);
  // const [loadingDevices, setLoadingDevices] = useState(true);

  // useEffect(() => {
  //   let unmounted = false;
  //   const getDevices = async () => {
  //     const res = await api.device.getDevices();
  //     if (res.type === 'GET_DEVICES' && !unmounted) {
  //       setDevices(res.devices.map((d) => ({ id: d.id, name: d.name })));
  //       setLoadingDevices(false);
  //     }
  //   };
  //   getDevices();
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(deviceActions.fetchDevices());
  }, [dispatch]);

  const initialValues: IDeviceBindingFormik = {
    ...deviceBinding,
    user: deviceBinding.user || null,
    device: deviceBinding.device || null,
    state: { id: deviceBinding.state, name: deviceStates[deviceBinding.state] },
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
      onSubmit({ ...values, state: values.state.id } as IDeviceBinding);
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
                    disabled={loading || loadingDevices}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    component={ComboBox}
                    name="state"
                    label="Статус"
                    type="state"
                    required={true}
                    options={Object.entries(deviceStates).map((key) => ({ id: key[0], name: key[1] })) || []}
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

export default DeviceBindingDetails;
