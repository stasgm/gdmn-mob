import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    // alignItems: 'center',
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {},
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  field: {
    opacity: 0.5,
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
    padding: 8,
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
