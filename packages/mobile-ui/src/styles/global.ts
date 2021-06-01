import { Dimensions, StyleSheet } from 'react-native';
import colors from './colors';

const globalstyles = StyleSheet.create({
  bottomButtons: {
    alignItems: 'flex-end',
  },
  buttons: {
    // margin: 5,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  btnTab: {
    width: Dimensions.get('window').width / 3.2,
    flexDirection: 'row',
    borderWidth: 0.5,
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
    // padding: 2,
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
  /*   container: {
      flex: 1,
      margin: 5,
    }, */
  content: {
    height: '100%',
    padding: 3,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: 36,
    justifyContent: 'center',
    width: 36,
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
  /*   title: {
      fontSize: 20,
      textAlign: 'center',
      padding: 10,
    }, */
  field: {
    opacity: 0.5,
  },
});

export default globalstyles;
