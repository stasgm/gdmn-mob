import { Box, CardHeader, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ICompany, NewCompany } from '@lib/types';

import { useEffect } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import { appSystemActions } from '../../store/appSystem';
import { userActions } from '../../store/user';
import CompanyAppSystemDetails from '../../components/company/CompanyAppSystemDetails';

export type Params = {
  id: string;
};

const CompanyAppSystemCreate = () => {
  const { id: companyId } = useParams<keyof Params>() as Params;
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

  const handleSubmit = async (values: ICompany | NewCompany) => {
    const res = await dispatch(companyActions.addCompany(values as NewCompany));
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
            <CardHeader title={'Добавление подсистемы'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        Добавить поля
        <CompanyAppSystemDetails
          company={{ name: '' } as ICompany}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
        />
      </Box>
    </>
  );
};

export default CompanyAppSystemCreate;
