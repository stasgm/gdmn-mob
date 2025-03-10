import { CardContent, Typography, Card, Grid } from '@mui/material';

import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  erpLog: string;
  title?: string;
}

const ServerLogDetailsView = ({ erpLog }: IProps) => {
  const maxHeight = useWindowResizeMaxHeight();

  return (
    <Card>
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight }}>
          <Grid container>
            <Grid item>
              <pre>
                <Typography variant="subtitle1" gutterBottom>
                  {erpLog}
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
