import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { Button, ListItem } from '@mui/material';

interface IProps {
  href: string;
  icon: any;
  title: string;
  compact: boolean;
}

const NavItem = ({ href, icon: Icon, title, compact, ...rest }: IProps) => {
  const location = useLocation();

  const active = href
    ? !!matchPath(
        {
          path: href,
          end: false,
        },
        location.pathname,
      )
    : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0,
        minHeight: '36px',
      }}
      {...rest}
    >
      <Button
        component={RouterLink}
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
          justifyContent: 'flex-start',
          letterSpacing: 0,
          py: compact ? 1 : 1.25,
          textTransform: 'none',
          width: '100%',
          ...(active && {
            color: 'primary.main',
          }),
          '& svg': {
            mr: 1,
          },
        }}
        to={href}
      >
        {Icon && <Icon size="20" />}
        {!compact && <span>{title}</span>}
      </Button>
    </ListItem>
  );
};

export default NavItem;
