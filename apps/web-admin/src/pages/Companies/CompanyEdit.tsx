import { useEffect } from 'react';

import { Box } from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { ICompany } from '@lib/types';

import CompanyDetails from '../../components/company/CompanyDetails';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';

const CompanyEdit = () => {
  const { id: companyId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);
  const company = useSelector((state) => state.companies.list.find((i) => i.id === companyId));

  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(actions.fetchCompanyById(companyId));
  }, [companyId, dispatch]);

  const onSuccessfulSave = () => {
    navigate('/app/companies');
  };

  const handleCancel = () => {
    navigate('/app/companies');
  };

  const handleClearError = () => {
    dispatch(actions.companyActions.clearError());
  };

  const handleSubmit = (values: ICompany) => {
    dispatch(actions.updateCompany(values, onSuccessfulSave));
  };

  if (!company) {
    return <Box>Компания не найдена</Box>;
  }

  return (
    <CompanyDetails
      mode="EDIT"
      company={company}
      errorMessage={errorMessage}
      loading={loading}
      onClearError={handleClearError}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyEdit;
