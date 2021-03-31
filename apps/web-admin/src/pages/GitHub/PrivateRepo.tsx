import { Helmet } from 'react-helmet';
import { makeStyles, createStyles } from '@material-ui/core/styles';

// components
import PageTitle from '../../components/PageTitle';

// constants
import { APP_TITLE, PAGE_TITLE_GH_PRIVATE } from '../../utils/constants';

// define css-in-js
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }),
);

const GHPrivate = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_GH_PRIVATE} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_GH_PRIVATE} />
      </div>
    </>
  );
};

export default GHPrivate;
