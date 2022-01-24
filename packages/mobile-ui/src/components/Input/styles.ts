import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
  },
  containerInput: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 15,
    position: 'relative',
  },
  button: {
    alignItems: 'flex-end',
    position: 'absolute',
    top: 5,
    right: 7,
    zIndex: 5,
    // width: '100%',
  },
});

export default styles;
