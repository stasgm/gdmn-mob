import { Box, CardHeader, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ICompany, NewCompany } from '@lib/types';

import { useEffect } from 'react';

import CompanyDetails from '../../components/company/CompanyDetails';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';
import appSystemActions from '../../store/appSystem';
import userActions from '../../store/user';

const CompanyCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(userActions.fetchUsers());
  }, [dispatch]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: ICompany | NewCompany) => {
    const res = await dispatch(actions.addCompany(values as NewCompany));
    if (res.type === 'COMPANY/ADD_SUCCESS') {
      handleGoBack();
    }
  };

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
            <CardHeader title={'Добавление компании'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <CompanyDetails
          company={{ name: '' } as ICompany}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
        />
      </Box>
    </>
  );
};

export default CompanyCreate;
