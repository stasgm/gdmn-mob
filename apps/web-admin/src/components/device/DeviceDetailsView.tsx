import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IDevice, IActivationCode } from '@lib/types';
/* import activationCode from '../../store/activationCode';*/

/*import { activationCodes } from '@lib/mock';*/

interface IProps {
  device: IDevice;
  activationCodes: IActivationCode[];
}

const DeviceDetailsView = ({ device, activationCodes }: IProps) => {
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
                  {device.state}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Код активации
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {activationCodes.find((a) => a.device.id === device.id)?.code}
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
