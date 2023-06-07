import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@mui/material';

import { IDevice } from '@lib/types';

import { deviceStates } from '../../utils/constants';

interface IProps {
  device: IDevice;
  activationCode?: string;
}

const DeviceDetailsView = ({ device, activationCode }: IProps) => {
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
                <Typography variant="h4" gutterBottom>
                  {device.name}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Номер
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {device.uid}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Состояние
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {deviceStates[device.state]}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Код активации
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {activationCode}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsView;
