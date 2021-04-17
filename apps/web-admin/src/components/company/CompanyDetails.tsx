import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  CircularProgress,
} from '@material-ui/core';

import { ICompany } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import SnackBar from '../SnackBar';

interface IProps {
  mode: 'VIEW' | 'CREATE' | 'EDIT';
  loading: boolean;
  errorMessage: string;
  company: ICompany;
  onClearError: () => void;
  onCancel: () => void;
  onSubmit: (values: ICompany) => void;
}

const CompanyDetails = ({ mode, company, loading, errorMessage, onSubmit, onClearError, onCancel }: IProps) => {
  const formik = useFormik<ICompany>({
    enableReinitialize: true,
    initialValues: company,
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
          p: 3,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Card sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CardHeader
                title={
                  mode === 'VIEW' ? 'Компания' : mode === 'CREATE' ? 'Добавление компании' : 'Редактирование компании'
                }
              />
              {loading && <CircularProgress size={20} />}
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    inputProps={{ readOnly: mode === 'VIEW' }}
                    fullWidth
                    helperText={mode === 'VIEW' ? undefined : 'Введите наименование компанинии'}
                    label="Наименование компанинии"
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
              </Grid>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              {mode !== 'VIEW' ? (
                <>
                  <Button color="secondary" variant="contained" onClick={onCancel} disabled={loading}>
                    Отмена
                  </Button>
                  <Button color="primary" disabled={loading} type="submit" variant="contained">
                    {mode === 'CREATE' ? 'Добавить' : 'Сохранить'}
                  </Button>
                </>
              ) : (
                <Button color="secondary" variant="contained" onClick={onCancel}>
                  Закрыть
                </Button>
              )}
            </Box>
          </Card>
        </form>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={onClearError} />
    </>
  );
};

export default CompanyDetails;
