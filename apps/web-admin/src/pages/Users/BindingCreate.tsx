import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/deviceBinding';
import BindingDetails from '../../components/deviceBinding/BindingDetails';

const BindingCreate = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.users);
  const user = useSelector((state) => state.users.list.find((i) => i.id === userId));

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.deviceBindingActions.clearError());
  };

  const handleSubmit = async (values: IDeviceBinding | NewDeviceBinding) => {
    const res = await dispatch(actions.addDeviceBinding(values as NewDeviceBinding));
    if (res.type === 'DEVICEBINDING/ADD_SUCCCES') {
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
            <CardHeader title={'Добавление устройства пользователю'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <BindingDetails
          deviceBinding={{ user } as NewDeviceBinding}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default BindingCreate;
