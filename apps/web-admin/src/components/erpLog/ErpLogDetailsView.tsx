import { CardContent, Typography, Card } from '@mui/material';

import Grid from '@mui/system/Grid';

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
            <Grid>
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
