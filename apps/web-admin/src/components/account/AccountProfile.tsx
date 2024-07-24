import { IUser } from '@lib/types';
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';

const avatar1 = require('../../../assets/images/avatar1.svg');

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
          src={avatar1}
          sx={{
            height: 100,
            width: 100,
          }}
        />
        <Typography color="textPrimary" gutterBottom variant="h3">
          {user.name}
        </Typography>
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
