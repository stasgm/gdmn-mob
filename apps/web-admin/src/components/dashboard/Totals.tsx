import { Avatar, Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

interface IProps {
  totalusers: number;
}

const TotalUsers = (props: IProps) => {
  const { totalusers } = props;

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Всего пользователей
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {totalusers}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: blue[600],
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            pt: 2,
          }}
        >
          <ArrowUpwardIcon sx={{ color: blue[900] }} />
          <Typography
            variant="body2"
            sx={{
              color: blue[900],
              mr: 1,
            }}
          >
            16%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            За последний месяц
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalUsers;
