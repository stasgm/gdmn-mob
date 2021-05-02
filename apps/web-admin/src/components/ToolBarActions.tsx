import { Button, Hidden, IconButton, Toolbar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { IToolBarButton } from '../types';

interface props {
  buttons: IToolBarButton[];
}

const ToolBarActions = ({ buttons }: props) => {
  const buttonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <Button key={button.name} color={button.color} variant={button.variant} onClick={button.onClick} sx={button.sx}>
          {button.name}
        </Button>
      ))}
    </>
  );

  const iconButtonList = (
    <>
      {buttons.map((button: IToolBarButton) => (
        <IconButton key={button.name} color="primary" onClick={button.onClick}>
          {button.icon}
        </IconButton>
      ))}
    </>
  );

  return (
    <Toolbar>
      <Hidden smUp>
        <IconButton color="primary">
          <MoreVertIcon />
        </IconButton>
      </Hidden>
      <Hidden mdUp smDown>
        {iconButtonList}
      </Hidden>
      <Hidden mdDown>{buttonList}</Hidden>
    </Toolbar>
  );
};

export default ToolBarActions;
