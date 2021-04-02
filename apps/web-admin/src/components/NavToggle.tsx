import { Hidden, Button } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

interface IProps {
  compact: boolean;
  setCompact: (compact: boolean) => void;
}

const NavToggle = ({ compact, setCompact }: IProps) => {
  return (
    <Hidden lgDown>
      <Button
        // component={RouterLink}
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
          justifyContent: compact ? 'flex-start' : 'flex-end',
          letterSpacing: 0,
          py: compact ? 1 : 1.25,
          textTransform: 'none',
          width: '100%',
        }}
        onClick={() => setCompact(!compact)}
      >
        <ChevronLeftIcon
          sx={{
            transition: 'transform 0.2s linear',
            transform: `rotate(${compact ? '180deg' : '0deg'})`,
          }}
        />
      </Button>
    </Hidden>
  );
};

export default NavToggle;
