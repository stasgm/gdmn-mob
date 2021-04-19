import {
  Box,
  CardHeader,
  Button,
  IconButton,
  CardContent,
  Grid,
  Card,
  Divider,
  TextField,
  CircularProgress,
} from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { ICompany } from '@lib/types';

import * as yup from 'yup';

import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';

const CompanyView = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);
  const company = useSelector((state) => state.companies.list.find((i) => i.id === companyId));

  const handleCancel = () => {
    navigate('/app/companies');
  };

  const handleEdit = () => {
    navigate(`/app/companies/edit/${companyId}`);
  };

  const handleRefresh = () => {
    dispatch(actions.fetchCompanyById(companyId));
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  if (!company) {
    return <Box>Компания не найдена</Box>;
  }

  // const formik = useFormik<ICompany>({
  //   enableReinitialize: true,
  //   initialValues: company,
  //   validationSchema: yup.object().shape({
  //     name: yup.string().required('Required'),
  //   }),
  //   onSubmit: (values) => {
  //     onSubmit(values);
  //   },
  // });

  return (
    <>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <IconButton color="primary" onClick={handleCancel}>
              <ArrowBackIcon />
            </IconButton>
            <CardHeader title={'Компания'} />
            {loading && <CircularProgress size={40} />}
          </Box>
          <Box
            sx={{
              justifyContent: 'right',
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleRefresh}
              disabled={loading}
              sx={{ marginRight: 1 }}
            >
              Обновить
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleEdit}
              disabled={loading}
              sx={{ marginRight: 1 }}
            >
              Редактировать
            </Button>
            <Button color="secondary" variant="contained" disabled={loading}>
              Удалить
            </Button>
          </Box>
        </Box>
        <>
          <Box
            sx={{
              backgroundColor: 'background.default',
              minHeight: '100%',
            }}
          >
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      inputProps={{ readOnly: 'true' }}
                      fullWidth
                      label="Наименование компании"
                      name="name"
                      variant="outlined"
                      type="name"
                      disabled={loading}
                      value={company.name}
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </>
      </Box>
    </>
  );
};

export default CompanyView;
