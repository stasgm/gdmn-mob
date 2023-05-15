import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

interface IProps {
  file: any;
}

const FileContentView = ({ file }: IProps) => {
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
