import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';
import { useEffect } from 'react';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import bindingActions from '../../store/deviceBinding';
import actions from '../../store/user';
import selectors from '../../store/user/selectors';
import DeviceBindingDetails from '../../components/deviceBinding/DeviceBindingDetails';

export type Params = {
  id: string;
};

const UserDeviceCreate = () => {
  const { id: userId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state) => state.deviceBindings);
  const user = selectors.userById(userId);

  useEffect(() => {
    dispatch(actions.fetchUserById(userId));
  }, [dispatch, userId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IDeviceBinding | NewDeviceBinding) => {
    const res = await dispatch(bindingActions.addDeviceBinding(values as NewDeviceBinding));
    if (res.type === 'DEVICEBINDING/ADD_SUCCES') {
      goBack();
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
            <CardHeader title={'Добавление устройства для пользователя'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <DeviceBindingDetails
          deviceBinding={{ user: { id: user?.id, name: user?.name }, state: 'NON-REGISTERED' } as IDeviceBinding}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      </Box>
    </>
  );
};

export default UserDeviceCreate;
