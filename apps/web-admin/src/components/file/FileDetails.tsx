import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { useCallback, useState } from 'react';

interface IProps {
  loading: boolean;
  file: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const FileDetails = ({ file, loading, onSubmit, onCancel }: IProps) => {
  const [fileJson, setFileJson] = useState(JSON.stringify(file, null, '\t'));

  const handleSubmit = useCallback(() => {
    onSubmit(JSON.parse(fileJson));
  }, [fileJson, onSubmit]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Grid container direction="column" item md={6} xs={12} spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="file"
                  required
                  variant="outlined"
                  onChange={(event) => setFileJson(event.target.value)}
                  type="name"
                  disabled={loading}
                  value={fileJson}
                  multiline
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <>
            <Button color="primary" disabled={loading} variant="contained" sx={{ m: 1 }} onClick={handleSubmit}>
              Сохранить
            </Button>
            <Button color="secondary" variant="contained" onClick={onCancel} disabled={loading}>
              Отмена
            </Button>
          </>
        </Card>
      </Box>
    </>
  );
};

export default FileDetails;
