import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { ICompany, NewCompany } from '@lib/types';

import CompanyDetails from '../../components/company/CompanyDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';

const CompanyCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);

  const handleGoToCompanies = () => {
    //navigate('/app/companies');
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleSubmit = async (values: ICompany | NewCompany) => {
    const res = await dispatch(actions.addCompany(values as NewCompany));
    if (res.type === 'COMPANY/ADD_SUCCESS') {
      handleGoToCompanies();
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
          onCancel={handleGoToCompanies}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default CompanyCreate;
