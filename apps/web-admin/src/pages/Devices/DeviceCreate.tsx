import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IDevice, NewDevice } from '@lib/types';

import { useEffect } from 'react';

import DeviceDetails from '../../components/device/DeviceDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/device';
import companyActions from '../../store/company';

const DeviceCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.devices);

  useEffect(() => {
    dispatch(companyActions.fetchCompanies());
  }, [dispatch]);

  const goBack = () => {
    dispatch(actions.clearError());
    navigate(-1);
  };

  const handleSubmit = async (values: IDevice | NewDevice) => {
    const res = await dispatch(actions.addDevice({ ...values } as NewDevice));
    if (res.type === 'DEVICE/ADD_SUCCESS') {
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
            <CardHeader title={'Добавление устройства'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <DeviceDetails
          device={{ name: '', state: 'NON-REGISTERED' } as IDevice}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      </Box>
    </>
  );
};

export default DeviceCreate;
