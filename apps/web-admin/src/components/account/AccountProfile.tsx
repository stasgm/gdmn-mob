import { IUser } from '@lib/types';
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@material-ui/core';

interface IProps {
  user: IUser;
}

const AccountProfile = ({ user }: IProps) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Avatar
          src={'/assets/images/avatar1.svg'}
          sx={{
            height: 100,
            width: 100,
          }}
        />
        <Typography color="textPrimary" gutterBottom variant="h3">
          {user.name}
        </Typography>
        {/* <Typography color="textSecondary" variant="body1">
          {`${user.city} ${user.country}`}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {`${user.timezone}`}
        </Typography>*/}
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button color="primary" fullWidth variant="text">
        Загрузить картинку
      </Button>
    </CardActions>
  </Card>
);

export default AccountProfile;
