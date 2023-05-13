import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

interface IProps {
  serverLog: any;
}

const ServerLogDetailsView = ({ serverLog }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto' }}>
          <Grid container>
            <Grid item>
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
