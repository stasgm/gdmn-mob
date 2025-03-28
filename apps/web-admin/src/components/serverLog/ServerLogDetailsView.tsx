import { CardContent, Typography, Card } from '@mui/material';

import Grid from '@mui/system/Grid';

import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  serverLog: string;
}

const ServerLogDetailsView = ({ serverLog }: IProps) => {
  const maxHeight = useWindowResizeMaxHeight();

  return (
    <Card>
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight }}>
          <Grid container>
            <Grid>
              <pre>
                <Typography variant="subtitle1" gutterBottom>
                  {serverLog}
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
