import { StyleSheet } from 'react-native';

import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  containerOutline: {
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  button: {
    alignSelf: 'center',
    height: 40,
  },
});
export default styles;
