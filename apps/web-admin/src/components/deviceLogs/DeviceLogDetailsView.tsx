import { IDeviceLogFile } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Divider } from '@mui/material';

import { NavLink } from 'react-router-dom';

import Grid from '@mui/system/Grid';

import { adminPath } from '../../utils/constants';

interface IProps {
  deviceLogs: IDeviceLogFile;
}

const DeviceLogDetailsView = ({ deviceLogs }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid>
            <Grid container>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Компания
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <NavLink to={`${adminPath}/app/companies/${deviceLogs.company?.id}`} key={deviceLogs.company?.id}>
                  <Typography color="textPrimary" variant="h4" key={deviceLogs.company?.id} gutterBottom>
                    {deviceLogs.company.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Подсистема
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {deviceLogs.appSystem.name}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Устройство
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {deviceLogs.device.name}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Идентификатор
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {deviceLogs.device.id}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Пользователь
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {deviceLogs.consumer?.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceLogDetailsView;
