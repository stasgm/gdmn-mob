import { IUser } from '@lib/types';
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography, Input } from '@material-ui/core';

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
      {/* <Input type="file" id="file-input" name="ImageStyle" /> */}
      <Button color="primary" fullWidth variant="text">
        Загрузить картинку
      </Button>
    </CardActions>
  </Card>
);

export default AccountProfile;
