import { Box, CardHeader, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ICompany } from '@lib/types';

import { useEffect } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import { appSystemActions } from '../../store/appSystem';
import { userActions } from '../../store/user';
import CompanyAppSystemDetails from '../../components/company/CompanyAppSystemDetails';

export type Params = {
  id: string;
  appSystemId: string;
};

const CompanyAppSystemEdit = () => {
  const { id: companyId, appSystemId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.companies);
  const company = companySelectors.companyById(companyId);

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(userActions.fetchUsers());
  }, [dispatch]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: ICompany) => {
    const res = await dispatch(companyActions.updateCompany(values as ICompany));
    if (res.type === 'COMPANY/UPDATE_SUCCESS') {
      handleGoBack();
    }
  };

  if (!company) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Компания не найдена
      </Box>
    );
  }

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
            <CardHeader title={'Изменение подсистемы'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <CompanyAppSystemDetails
          company={company}
          appSystemId={appSystemId}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
        />
      </Box>
    </>
  );
};

export default CompanyAppSystemEdit;
