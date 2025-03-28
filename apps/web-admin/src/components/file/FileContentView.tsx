import { CardContent, Typography, Card } from '@mui/material';
import Grid from '@mui/system/Grid';

interface IProps {
  file: any;
}

const FileContentView = ({ file }: IProps) => {
  return (
    <Card>
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto' }}>
          <Grid container>
            <Grid>
              <pre>
                <Typography variant="subtitle1" gutterBottom>
                  {JSON.stringify(file, null, '\t')}
                </Typography>
              </pre>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FileContentView;
