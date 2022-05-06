import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { IAppSystem, NewAppSystem } from '@lib/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface IProps {
  loading: boolean;
  appSystem: IAppSystem | NewAppSystem;
  onSubmit: (values: IAppSystem | NewAppSystem) => void;
  onCancel: () => void;
}

const AppSystemDetails = ({ appSystem, loading, onSubmit, onCancel }: IProps) => {
  const formik = useFormik<IAppSystem | NewAppSystem>({
    enableReinitialize: true,
    initialValues: { ...appSystem, description: appSystem.description || '' },
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
                    label="Наименование подсистемы"
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
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    fullWidth
                    label="Описание подсистемы"
                    name="description"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="description"
                    disabled={loading}
                    value={formik.values.description}
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

export default AppSystemDetails;
