import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  serverName: {
    color: '#888',
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
    fontSize: 16,
  },
});

export default localStyles;
