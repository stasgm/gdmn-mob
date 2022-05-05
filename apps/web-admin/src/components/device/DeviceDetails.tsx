import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IDevice, INamedEntity } from '@lib/types';
import { useFormik, FormikProvider, Field } from 'formik';
import * as yup from 'yup';

import ComboBox from '../ComboBox';

import { deviceStates } from '../../utils/constants';

interface IProps {
  loading: boolean;
  device: IDevice;
  activationCode?: string;
  onSubmit: (values: IDevice) => void;
  onCancel: () => void;
  //onCreateUid?: (code: string) => void;
}

export interface IDeviceFormik extends Omit<IDevice, 'state'> {
  state: INamedEntity;
  code: string;
}

// export interface IActivationCodeFormik extends Omit<IActivationCode, 'code'> {
//   code: INamedEntity;
// }

const DeviceDetails = ({ device, activationCode, loading, onSubmit, onCancel /*, onCreateUid*/ }: IProps) => {
  const initialValues: IDeviceFormik = {
    ...device,
    // user: deviceBinding.user || null,
    // device: deviceBinding.device || null,
    state: { id: device.state, name: deviceStates[device.state] },
    code: activationCode || '',
  };

  const formik = useFormik<IDeviceFormik>({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
      state: yup.object().required('Required'),
      // code: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit({ id: values.id, name: values.name, state: values.state.id, uid: values.uid } as IDevice); /*(values);*/
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
                    required={true}
                    options={Object.entries(deviceStates).map((key) => ({ id: key[0], name: key[1] })) || []} //+
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.state && formik.errors.state)}
                    disabled={loading}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.code && Boolean(formik.errors.code)}
                    fullWidth
                    label="Код активации"
                    name="code"
                    // required
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="code"
                    disabled={true}
                    value={formik.values.code}
                  />
                </Grid>
                {/* <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}> */}
                <Grid container direction="row" item /*md={6}*/ xs={12}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      error={formik.touched.uid && Boolean(formik.errors.uid)}
                      fullWidth
                      label="Номер"
                      name="uid"
                      // required
                      variant="outlined"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="uid"
                      disabled={true}
                      value={formik.values.uid}
                    />
                  </Grid>
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
