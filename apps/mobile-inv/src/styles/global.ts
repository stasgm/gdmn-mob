import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bottomButtons: {
    alignItems: 'flex-end',
  },
  buttonText: {
    fontSize: 18,
  },
  circularButton: {
    borderRadius: 50,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
  },
  input: {
    fontSize: 18,
    height: 50,
    marginTop: 15,
    //padding: 10,
  },
  rectangularButton: {
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    marginVertical: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  title: {
    textAlign: 'center',
  },
});

export default styles;
