import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
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
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  textDescription: {
    fontSize: 11,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  field: {
    opacity: 0.5,
  },
  input: {
    height: 40,
    marginLeft: 12,
    // borderWidth: 1,
  },
});
