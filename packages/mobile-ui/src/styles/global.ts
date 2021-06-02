import { Dimensions, StyleSheet } from 'react-native';

const globalstyles = StyleSheet.create({
  bottomButtons: {
    alignItems: 'flex-end',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnTab: {
    width: Dimensions.get('window').width / 3.2,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderRadius: 0,
    padding: 10,
    justifyContent: 'center',
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
    padding: 5,
  },
  input: {
    fontSize: 18,
    height: 50,
    marginTop: 15,
  },
  rectangularButton: {
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginVertical: 15,
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
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    margin: 3,
    fontSize: 18,
    textAlign: 'center',
  },
  content: {
    height: '100%',
    padding: 3,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    margin: 5,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  textDescription: {
    fontSize: 11,
  },
  field: {
    opacity: 0.5,
  },
  lightField: {
    fontSize: 15,
    color: '#fff',
  },
});

export default globalstyles;
