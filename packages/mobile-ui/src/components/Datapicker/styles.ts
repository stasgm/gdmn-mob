import { StyleSheet } from 'react-native';

import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    width: '85%',
    alignItems: 'center',
  },
  datapicker: {
    width: '100%',
    paddingBottom: 22,
  },
  dataInput: {
    borderColor: colors.light,
    borderRadius: 8,
    borderWidth: 2,
  },
  dataText: {
    color: colors.text,
  },
  label: {
    paddingLeft: '2%',
    color: colors.light,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
});

export default styles;
