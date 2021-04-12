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
  Snackbar,
  Alert,
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { ICompany } from '@lib/client-types';

import { v4 as uuid } from 'uuid';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';

const NewCompany = (props: any) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companiesReducer);

  const { id: companyId } = useParams();

  const isAddMode = !companyId;

  const [loaded, setLoaded] = useState(false);

  const [companyForm, setCompanyForm] = useState<ICompany>({
    admin: '',
    id: uuid(), // времено ID будет присваиваться сервером
    name: '',
  });

  const handleChange = (event: any) => {
    setCompanyForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSuccessfulLoad = (company?: ICompany) => {
    if (company) {
      setCompanyForm(company);
    }
    setLoaded(true);
  };

  useEffect(() => {
    if (isAddMode && !companyId) {
      return;
    }

    dispatch(actions.fetchCompanyById(companyId, onSuccessfulLoad));
  }, [companyId, dispatch, isAddMode]);

  const onSuccessfulSave = () => {
    navigate('/app/companies');
  };

  const handleCancel = () => {
    navigate('/app/companies');
  };

  const handleSubmit = () => {
    dispatch(
      isAddMode
        ? actions.addCompany(companyForm, onSuccessfulSave)
        : actions.updateCompany(companyForm, onSuccessfulSave),
    );
  };

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

  console.log('isAddMode', isAddMode);
  console.log('companyForm', companyForm);
  console.log('loaded', loaded);

  if (!isAddMode && !companyForm?.name && loaded) {
    // Если редактирование  компании и компания не найдена
    return <Box>Компания не найдена</Box>;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
    >
      <form autoComplete="off" noValidate {...props}>
        <Card>
          <Box
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              alignItems: 'center',
              // p: 2,
            }}
          >
            <CardHeader title={`${!companyForm.id ? 'Новая компания' : 'Компания'}`} />
            {loading && <CircularProgress size={20} />}
          </Box>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Введите название организации"
                  label="Название организации"
                  name="name"
                  onChange={handleChange}
                  required
                  value={companyForm.name}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.title}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.title}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.title}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.title}
                variant="outlined"
              />
            </Grid> */}
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
            <Button color="secondary" variant="contained" onClick={handleCancel} disabled={loading}>
              Отмена
            </Button>
            <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
              Сохранить
            </Button>
          </Box>
        </Card>
      </form>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewCompany;
