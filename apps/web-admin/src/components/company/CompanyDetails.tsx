import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ICompany } from '@lib/types';
import { v4 as uuid } from 'uuid';

import { useSelector } from '../../store';

import companyAsyncActions from '../../store/company/actions.async';

// import { Spinner } from './CompanyListResults';

const CompanyDetails = (props: any) => {
  const dispatch = useDispatch();
  const { errorMessage, loading } = useSelector((state) => state.companies);

  const { id: selectedCompanyId } = useParams();
  const isAddMode = !selectedCompanyId;

  const [values, setValues] = useState<ICompany>({
    admin: '',
    id: uuid(),
    title: '',
  });

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  let company: ICompany | undefined = {
    admin: '',
    id: uuid(),
    title: '',
  };

  if (!isAddMode) {
    company = useSelector((state) => state.companies.list?.find(({ id }) => id === selectedCompanyId));

    if (!company) {
      return <Box>Компания не найдена</Box>;
    }
  }

  const { title, id } = company;

  const navigate = useNavigate();

  const handleSubmit = () => {
    // console.log('handleSubmit', company, values.title);
    isAddMode
      ? dispatch(companyAsyncActions.addCompany(values))
      : company
        ? dispatch(companyAsyncActions.updateCompany({ ...values, id: company.id }))
        : console.log('company does not find');
    navigate('/app/companies');
  };

  useEffect(() => {
    setValues((prev) => ({ ...prev, title }));
  }, [selectedCompanyId, title]);

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader subheader="The information can be edited" title={`${!id ? 'Новая ' : ''} компания`} />
        <Divider />
        <Box>
          {loading && <CircularProgress size={20} />} {errorMessage && <Typography>{errorMessage}</Typography>}
        </Box>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Введите название организации"
                label="Название организации"
                name="title"
                onChange={handleChange}
                required
                value={values.title}
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
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default CompanyDetails;
