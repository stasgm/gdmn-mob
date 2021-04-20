import { Box, CircularProgress, CardHeader } from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { ICompany } from '@lib/types';

import CompanyDetails from '../../components/company/CompanyDetails';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';
import SnackBar from '../../components/SnackBar';

const CompanyEdit = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);
  const company = useSelector((state) => state.companies.list.find((i) => i.id === companyId));

  const handleGoBack = () => {
    navigate(`/app/companies/${companyId}`);
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleSubmit = (values: ICompany) => {
    dispatch(actions.updateCompany(values, handleGoBack));
  };

  if (!company) {
    return <Box>Компания не найдена</Box>;
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
      <CompanyDetails company={company} loading={loading} onSubmit={handleSubmit} onCancel={handleGoBack} />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default CompanyEdit;
