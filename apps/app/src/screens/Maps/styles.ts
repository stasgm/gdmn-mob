import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerMap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
  details: {
    flex: 1,
  },
  directionRow: {
    //justifyContent: 'flex-end',
    justifyContent: 'space-between',
    //bottom: 0,
    position: 'absolute',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {
    margin: 20,
    /*bottom: 0,
    position: 'absolute',
    right: 0,*/
  },
  field: {
    opacity: 0.5,
  },
  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
});

export default styles;
