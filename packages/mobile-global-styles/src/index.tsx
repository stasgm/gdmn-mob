import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
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
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#F00',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    height: 50,
    marginTop: 15,
    // padding: 2,
  },
  rectangularButton: {
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginVertical: 15,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  subHeader: {
    padding: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
  },
});

export { globalStyles };
