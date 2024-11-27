import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@mui/material';

import { ICompany, NewCompany } from '@lib/types';
import { useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';

import { useEffect } from 'react';

import MultipleAutocomplete from '../MultipleAutocomplete';
import { useDispatch, useSelector } from '../../store';
import { appSystemActions } from '../../store/appSystem';
import ComboBox from '../ComboBox';

interface IProps {
  loading: boolean;
  company: ICompany | NewCompany;
  onSubmit: (values: ICompany | NewCompany) => void;
  onCancel: () => void;
}

const CompanyAppSystemDetails = ({ company, loading, onSubmit, onCancel }: IProps) => {
  const { list, loading: loadingAppSystems } = useSelector((state) => state.appSystems);
  const { list: users, loading: loadingUsers } = useSelector((state) => state.users);

  const { user: authUser } = useSelector((state) => state.auth);

  const adminList = users.filter((i) => i.role === 'Admin' && !i.company).map((d) => ({ id: d.id, name: d.name }));

  const isAdminRequired = authUser?.role === 'SuperAdmin' && !company.admin;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
  }, [dispatch]);

  const formik = useFormik<ICompany | NewCompany>({
    enableReinitialize: true,
    initialValues: { ...company, city: company.city || '' },
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit({ ...values, name: values.name.trim() });
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
                    fullWidth
                    label="Компания"
                    name="company"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="city"
                    required={true}
                    disabled={loading}
                    value={formik.values.city}
                  />
                  <TextField
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    fullWidth
                    label="Подсистема"
                    name="city"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="city"
                    disabled={loading}
                    value={formik.values.city}
                  />
                  <TextField
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    fullWidth
                    label="Количество устройств"
                    name="city"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="city"
                    disabled={loading}
                    value={formik.values.city}
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
