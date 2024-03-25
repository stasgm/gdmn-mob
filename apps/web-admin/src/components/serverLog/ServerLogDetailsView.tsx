import { IServerLogResponse } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@mui/material';

import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  serverLog: IServerLogResponse;
  title?: string;
}

const ServerLogDetailsView = ({ serverLog, title }: IProps) => {
  const maxHeight = useWindowResizeMaxHeight();
  return (
    <Card>
      <CardHeader title={title || 'Общая информация'} />
      <Divider />
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight }}>
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
