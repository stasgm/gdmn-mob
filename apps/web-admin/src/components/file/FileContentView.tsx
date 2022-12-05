import { IDeviceLogFiles } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

interface IProps {
  file: any;
}

const FileContentView = ({ file }: IProps) => {
  return (
    <Card>
      {/* <Box sx={{ p: 1, overflowX: 'auto' }}> */}

      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid sx={{ overflowX: 'scroll' }}>
          {/* <Grid> */}
          <Grid container>
            <Grid item>
              <pre>
                <Typography variant="subtitle1" gutterBottom>
                  {JSON.stringify(file, null, '\t')}
                </Typography>
              </pre>
            </Grid>
            {/* </Grid> */}
          </Grid>
        </Grid>
        {/* <JSONViewer data={file} /> */}
        {/* <ReactJson
          src={file}
          theme="shapeshifter:inverted"
          style={{ fontSize: 14, fontFamily: 'inherit' && 'sans-serif' }}
          displayDataTypes={false}
          displayObjectSize={false}
        /> */}
      </CardContent>
    </Card>
  );
};

export default FileContentView;
