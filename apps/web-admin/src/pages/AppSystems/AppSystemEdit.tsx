import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IAppSystem, NewAppSystem } from '@lib/types';

import AppSystemDetails from '../../components/appSystem/AppSystemDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/appSystem';
import selectors from '../../store/appSystem/selectors';

export type Params = {
  id: string;
};

const AppSystemEdit = () => {
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state) => state.companies);
  const appSystem = selectors.appSystemById(id);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IAppSystem | NewAppSystem) => {
    const res = await dispatch(actions.updateAppSystem(values as IAppSystem));
    if (res.type === 'APP_SYSTEM/UPDATE_SUCCESS') {
      goBack();
    }
  };

  if (!appSystem) {
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
        <CardHeader title={'Редактирование подсистемы'} />
        {loading && <CircularProgress size={40} />}
      </Box>
      <AppSystemDetails appSystem={appSystem} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
    </Box>
  );
};

export default AppSystemEdit;
