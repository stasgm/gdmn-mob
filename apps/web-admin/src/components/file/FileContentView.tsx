import { CardContent, Typography, Card, Grid } from '@mui/material';

interface IProps {
  file: any;
}

const FileContentView = ({ file }: IProps) => {
  return (
    <Card>
      <CardContent>
        <Grid sx={{ overflowX: 'auto', overflowY: 'auto' }}>
          <Grid container>
            <Grid item>
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
