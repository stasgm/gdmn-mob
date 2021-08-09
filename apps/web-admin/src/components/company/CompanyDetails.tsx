import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { ICompany, NewCompany } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  company: ICompany | NewCompany;
  onSubmit: (values: ICompany | NewCompany) => void;
  onCancel: () => void;
}

const CompanyDetails = ({ company, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<ICompany | NewCompany>({
    enableReinitialize: true,
    initialValues: { ...company, city: company.city || '' },
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
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
