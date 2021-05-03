import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IDevice } from '@lib/types';

interface IProps {
  device: IDevice;
}

const DeviceDetailsView = ({ device }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid>
            <Grid container md={10} xs={12}>
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
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailsView;
