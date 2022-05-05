import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IAppSystem, ICompany, NewAppSystem, NewCompany } from '@lib/types';

import { useCallback, useEffect } from 'react';

import AppSystemDetails from '../../components/appSystem/AppSystemDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/appSystem';

const AppSystemCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.appSystems);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.appSystemActions.clearError());
  };

  const handleSubmit = async (values: IAppSystem | NewAppSystem) => {
    const res = await dispatch(actions.addAppSystem(values as NewAppSystem));
    if (res.type === 'APP_SYSTEM/ADD_SUCCESS') {
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
        <AppSystemDetails
          appSystem={{ name: '' } as IAppSystem}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default AppSystemCreate;