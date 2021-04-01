import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// constants
import { FOOTER_TEXT, FOOTER_HEIGHT } from '../utils/constants';

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      background: theme.palette.background.paper,
      minHeight: FOOTER_HEIGHT,
    },
    footer: {
      textTransform: 'uppercase',
    },
  }),
);

// functional component
const Footer = () => {
  const classes = useStyles();
  return <div className={classes.root}>{FOOTER_TEXT}</div>;
};

export default Footer;
