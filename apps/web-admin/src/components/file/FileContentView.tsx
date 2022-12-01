import { IDeviceLogFiles } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { JSONViewer } from 'react-json-editor-viewer';

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
            <Grid item md={2} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {JSON.stringify(file)}
              </Typography>
            </Grid>
            {/* </Grid> */}
          </Grid>
        </Grid>
        <JSONViewer data={file} />
      </CardContent>
    </Card>
  );
};

export default FileContentView;
