import { Box, CircularProgress, Typography } from '@mui/material';

const CircularProgressWithContent = (props: any) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 2 }}>
      <CircularProgress />
      <Typography variant="caption" component="div" color="textSecondary" sx={{ m: 2 }}>
        {props.content}
      </Typography>
    </Box>
  );
};

export default CircularProgressWithContent;
