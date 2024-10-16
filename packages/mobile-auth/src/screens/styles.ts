import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  serverName: {
    fontSize: 18,
    marginBottom: 18,
  },
  button: {
    flex: 1,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scroll: {
    width: '100%',
    marginVertical: 10,
    maxHeight: 200,
  },
  serverMode: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  serverModeText: {
    fontSize: 18,
  },
  textWidth: {
    marginHorizontal: 10,
  },
});

export default localStyles;
