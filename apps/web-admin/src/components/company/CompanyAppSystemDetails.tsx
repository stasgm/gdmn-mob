import { Box, Card, CardContent, Grid2 as Grid, TextField, Divider, Button } from '@mui/material';

import { ICompany, INamedEntity } from '@lib/types';
import { useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';

import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../store';
import { appSystemActions } from '../../store/appSystem';
import ComboBox from '../ComboBox';

interface IProps {
  loading: boolean;
  company: ICompany;
  appSystemId?: string;
  onSubmit: (values: ICompany) => void;
  onCancel: () => void;
}

const CompanyAppSystemDetails = ({ company, loading, appSystemId, onSubmit, onCancel }: IProps) => {
  const { list, loading: loadingAppSystems } = useSelector((state) => state.appSystems);
  const appSystem = company.appSystems?.find((i) => i.id === appSystemId);
  const appSystems =
    list?.map((l) => ({ id: l.id, name: l.name })).filter((l) => !company.appSystems?.find((a) => a.id === l.id)) || [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
  }, [dispatch]);

  const formik = useFormik<{ appSystem: INamedEntity; deviceCount: number }>({
    enableReinitialize: true,
    initialValues: {
      appSystem: {
        id: appSystemId || '',
        name: appSystem?.name || '',
      },
      deviceCount: appSystem?.deviceCount || 0,
    },
    validationSchema: yup.object().shape({
      appSystem: yup.object().required('Required'),
      deviceCount: yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...company,
        appSystems: appSystemId
          ? [
              ...(company.appSystems || []).map((as) => {
                return as.id === appSystemId ? { ...values.appSystem, deviceCount: values.deviceCount } : as;
              }),
            ]
          : [...(company.appSystems || []), { ...values.appSystem, deviceCount: values.deviceCount }],
      });
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
              <Grid container direction="column" size={{ md: 6, xs: 12 }} spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Компания"
                    name="company"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="company"
                    required={true}
                    disabled={true}
                    value={company.name}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Field
                    component={ComboBox}
                    name="appSystem"
                    label="Подсистема"
                    type="appSystem"
                    options={appSystems}
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.appSystem && formik.errors.appSystem)}
                    disabled={loadingAppSystems || appSystemId}
                    // required={isAdminRequired}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Количество устройств"
                    name="deviceCount"
                    variant="outlined"
                    value={formik.values.deviceCount}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="deviceCount"
                    disabled={loading}
                    error={Boolean(formik.touched.deviceCount && formik.errors.deviceCount)}
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

export default CompanyAppSystemDetails;
