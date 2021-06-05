import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  serverName: {
    color: '#888',
    fontSize: 18,
    marginVertical: 10,
  },
  statusBox: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inner: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});

export default localStyles;
