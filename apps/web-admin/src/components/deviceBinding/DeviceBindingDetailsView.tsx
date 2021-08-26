import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IDeviceBinding } from '@lib/types';

import { NavLink } from 'react-router-dom';

import { deviceStates, adminPath } from '../../utils/constants';

interface IProps {
  deviceBinding: IDeviceBinding;
  activationCode?: string;
}

const DeviceBindingDetailsView = ({ deviceBinding }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid>
            <Grid container>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Наименование
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <NavLink to={`${adminPath}/app/devices/${deviceBinding.device.id}`} key={deviceBinding.device.id}>
                  <Typography color="textPrimary" variant="h4" key={deviceBinding.device.id} gutterBottom>
                    {deviceBinding.device.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Пользователь
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <NavLink to={`${adminPath}/app/users/${deviceBinding.user.id}`} key={deviceBinding.user.id}>
                  <Typography color="textPrimary" variant="h4" key={deviceBinding.user.id} gutterBottom>
                    {deviceBinding.user.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Состояние
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {deviceStates[deviceBinding.state]}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceBindingDetailsView;
