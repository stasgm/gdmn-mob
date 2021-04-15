import { useState, useEffect } from 'react';
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
  Typography,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { NewCompany } from '@lib/types';

import { useFormik } from 'formik';
import * as yup from 'yup';
// import { v4 as uuid } from 'uuid';

// import { ICompany } from '@lib/client-types';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';
import SnackBar from '../SnackBar';

const NewCompany = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companiesReducer);

  // const [loaded, setLoaded] = useState(false);

  // const [companyForm, setCompanyForm] = useState<ICompany>({
  //   admin: {},
  //   id: uuid(), // времено ID будет присваиваться сервером
  //   name: '',
  // });

  // const handleChange = (event: any) => {
  //   setCompanyForm((prev) => ({
  //     ...prev,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  // const onSuccessfulLoad = (company?: ICompany) => {
  //   if (company) {
  //     setCompanyForm(company);
  //   }
  //   setLoaded(true);
  // };

  // useEffect(() => {
  //   if (isAddMode && !companyId) {
  //     return;
  //   }

  //   dispatch(actions.fetchCompanyById(companyId, onSuccessfulLoad));
  // }, [companyId, dispatch, isAddMode]);

  const onSuccessfulSave = () => {
    navigate('/app/companies');
  };

  const handleCancel = () => {
    navigate('/app/companies');
  };

  // const handleSubmit = () => {
  //   dispatch(
  //     isAddMode
  //       ? actions.addCompany(companyForm, onSuccessfulSave)
  //       : actions.updateCompany(companyForm, onSuccessfulSave),
  //   );
  // };

  // SnackBar
  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(actions.companyActions.clearError());
    setOpenAlert(false);
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    setOpenAlert(true);
  }, [errorMessage]);

  const formik = useFormik<NewCompany>({
    initialValues: {
      name: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      dispatch(actions.addCompany(values, onSuccessfulSave));
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <Box
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              alignItems: 'center',
              // p: 2,
            }}
          >
            <CardHeader title={'Новая компания'} />
            {loading && <CircularProgress size={20} />}
          </Box>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  fullWidth
                  helperText="Введите наименование организации"
                  label="Наименование организации"
                  name="name"
                  required
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="name"
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
            <Button color="primary" size="small" type="button" variant="contained" onClick={handleCancel}>
              <Typography>Отмена</Typography>
            </Button>
            <Button
              color="primary"
              disabled={loading || !!formik.errors.name}
              size="small"
              type="submit"
              variant="contained"
            >
              <Typography>Сохранить</Typography>
            </Button>
          </Box>
        </Card>
      </form>
      <SnackBar errorMessage={errorMessage} onCleanError={() => dispatch(actions.companyActions.clearError())} />
      {/* <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}!
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default NewCompany;
