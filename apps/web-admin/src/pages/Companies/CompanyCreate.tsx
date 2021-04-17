import { useNavigate } from 'react-router-dom';
import { ICompany } from '@lib/types';

import CompanyDetails from '../../components/company/CompanyDetails';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/company';

const CompanyCreate = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);

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

  return (
    <CompanyDetails
      mode="CREATE"
      company={{ name: '' } as ICompany}
      errorMessage={errorMessage}
      loading={loading}
      onClearError={handleClearError}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyCreate;
