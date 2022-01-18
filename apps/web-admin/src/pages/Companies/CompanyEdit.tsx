import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { ICompany, NewCompany } from '@lib/types';

import CompanyDetails from '../../components/company/CompanyDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/company';
import selectors from '../../store/company/selectors';
import SnackBar from '../../components/SnackBar';

export type Params = {
  id: string;
};

const CompanyEdit = () => {
  const { id: companyId } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);
  const company = selectors.companyById(companyId);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleSubmit = async (values: ICompany | NewCompany) => {
    const res = await dispatch(actions.updateCompany(values as ICompany));
    if (res.type === 'COMPANY/UPDATE_SUCCESS') {
      goBack();
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
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardHeader title={'Редактирование компании'} />
        {loading && <CircularProgress size={40} />}
      </Box>
      <CompanyDetails company={company} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default CompanyEdit;
