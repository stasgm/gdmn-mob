import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  Typography,
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { ICompany } from '@lib/types';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';

const ViewCompany = (company: ICompany) => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companiesReducer);

  // const [loaded, setLoaded] = useState(false);

  // const [companyForm, setCompanyForm] = useState<ICompany>({
  //   admin: '',
  //   id: uuid(), // времено ID будет присваиваться сервером
  //   name: '',
  // });

  // const handleChange = (event: any) => {
  //   setCompanyForm((prev) => ({
  //     ...prev,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  // const onSuccessfulLoad = () => {
  //   // if (company) {
  //   //   setCompanyForm(company);
  //   // }
  //   setLoaded(true);
  // };

  useEffect(() => {
    // if (isAddMode && !companyId) {
    //   return;
    // }

    dispatch(actions.fetchCompanyById(companyId));
  }, [companyId, dispatch]);

  const onSuccessfulSave = () => {
    navigate('/app/companies');
  };

  // const handleCancel = () => {
  //   navigate('/app/companies');
  // };

  // const handleSubmit = () => {
  //   dispatch(actions.updateCompany(companyForm, onSuccessfulSave));
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

  const formik = useFormik<ICompany>({
    initialValues: company,
    validationSchema: yup.object().shape({
      userName: yup.string().required('Required'),
      password: yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      dispatch(actions.updateCompany(values, onSuccessfulSave));
    },
    onReset: () => {
      navigate('/app/companies');
    },
  });

  return (
    <>
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
            <CardHeader title={'Компания'} />
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
            {/* <Button color="secondary" variant="contained" onClick={handleCancel} disabled={loading}>
              Отмена
            </Button> */}
            {/* <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
              Сохранить
            </Button> */}
            <Button color="primary" fullWidth size="small" type="reset" variant="contained">
              <Typography>Отмена</Typography>
            </Button>
            <Button
              color="primary"
              disabled={loading || !!formik.errors.name}
              fullWidth
              size="small"
              type="submit"
              variant="contained"
            >
              {loading && <CircularProgress size={20} />} <Typography>Сохранить</Typography>
            </Button>
          </Box>
        </Card>
      </form>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ViewCompany;
