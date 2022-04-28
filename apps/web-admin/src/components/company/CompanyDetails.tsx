import { Box, Card, CardContent, Grid, TextField, Divider, Button, Autocomplete } from '@material-ui/core';

import { IAppSystem, ICompany, NewCompany } from '@lib/types';
import { useFormik, Field, FieldArray } from 'formik';
import * as yup from 'yup';

import MultipleAutocomplete from '../MultipleAutocomplete';

interface IProps {
  loading: boolean;
  company: ICompany | NewCompany;
  appSystems?: IAppSystem[];
  onSubmit: (values: ICompany | NewCompany) => void;
  onCancel: () => void;
}

const CompanyDetails = ({ company, appSystems, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<ICompany | NewCompany>({
    enableReinitialize: true,
    initialValues: { ...company, city: company.city || '', appSystems: company.appSystems },
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  console.log('app', appSystems);

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
              <Grid container direction="column" item md={6} xs={12} spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    fullWidth
                    label="Наименование компании"
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
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    fullWidth
                    label="Город"
                    name="city"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="city"
                    disabled={loading}
                    value={formik.values.city}
                  />
                </Grid>
                {/* <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.appSystems && Boolean(formik.errors.appSystems)}
                    fullWidth
                    label="app"
                    name="app"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="app"
                    disabled={loading}
                    value={formik.values.appSystems}
                  />
                </Grid> */}
                {/* <Grid item md={6} xs={12}>
                  <Autocomplete
                    multiple
                    error={formik.touched.appSystems && Boolean(formik.errors.appSystems)}
                    fullWidth
                    id="tags-outlined"
                    options={appSystems || []}
                    getOptionLabel={(option) => option?.name}
                    defaultValue={[appSystems?.[1]]}
                    value={formik.values.appSystems}
                    filterSelectedOptions
                    renderInput={(params) => <TextField {...params} label="Системы" />}
                  />
                </Grid> */}
                {/* <Grid item md={6} xs={12}>
                  <Field
                    component={MultipleAutocomplete}
                    name="appSystems"
                    label="Системы"
                    type="appSystems"
                    options={appSystems || []} //+
                    setFieldValue={formik.setFieldValue}
                    setTouched={formik.setTouched}
                    error={Boolean(formik.touched.appSystems && formik.errors.appSystems)}
                    disabled={loading}
                  />
                </Grid> */}
                {/* <Grid item md={6} xs={12}>
                  <FieldArray
                    name="appSystems"
                    render={(arrayHelpers) => (
                      <Box>
                        {formik.values.appSystems && formik.values.appSystems.length > 0 ? (
                          formik.values.appSystems.map((appSystem) => {
                            return appSystem;
                          })
                        ) : (
                          <></>
                        )}
                      </Box>
                    )}
                  ></FieldArray>
                </Grid> */}
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

export default CompanyDetails;
