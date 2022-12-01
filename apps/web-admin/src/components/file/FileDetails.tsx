import { Box, Card, CardContent, Grid, TextField, Divider, Button } from '@material-ui/core';

import { useState } from 'react';

interface IProps {
  loading: boolean;
  file: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const FileDetails = ({ file, loading, onSubmit, onCancel }: IProps) => {
  // const formik = useFormik<any>({
  //   enableReinitialize: true,
  //   initialValues: JSON.stringify(file),
  //   onSubmit: (values) => {
  //     onSubmit(JSON.parse(values));
  //   },
  // });

  const [fileJson, setFileJson] = useState(JSON.stringify(file));

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        {/* <form onSubmit={formik.handleSubmit}> */}
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Grid container direction="column" item md={6} xs={12} spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  // error={formik.touched && Boolean(formik.errors)}
                  fullWidth
                  // label="Наименование"
                  name="file"
                  required
                  variant="outlined"
                  // onBlur={formik.handleBlur}
                  // onChange={formik.handleChange}
                  onChange={(event) => setFileJson(event.target.value)}
                  type="name"
                  disabled={loading}
                  // value={formik.values}
                  value={fileJson}
                  multiline
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <>
            <Button color="primary" disabled={loading} type="submit" variant="contained" sx={{ m: 1 }}>
              Сохранить
            </Button>
            <Button color="secondary" variant="contained" onClick={onCancel} disabled={loading}>
              Отмена
            </Button>
          </>
        </Card>
        {/* </form> */}
      </Box>
    </>
  );
};

export default FileDetails;
