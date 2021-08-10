import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IDevice, IDeviceBinding } from '@lib/types';
/* import activationCode from '../../store/activationCode';*/

/*import { activationCodes } from '@lib/mock';*/

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
                <Typography variant="h4" gutterBottom>
                  {deviceBinding.state}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Номер
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {deviceBinding.state}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Состояние
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {deviceBinding.state}
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
