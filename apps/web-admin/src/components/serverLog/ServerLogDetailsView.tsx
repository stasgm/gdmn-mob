import { IServerLogResponse } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

interface IProps {
  serverLog: IServerLogResponse;
  title?: string;
}

const ServerLogDetailsView = ({ serverLog, title }: IProps) => {
  return (
    <Card>
      <CardHeader title={title || 'Общая информация'} />
      <Divider />
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: window.innerHeight - 270 }}>
          <Grid container>
            <Grid item>
              <pre>
                <Typography variant="subtitle1" gutterBottom>
                  {serverLog.textFile}
                </Typography>
              </pre>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ServerLogDetailsView;
