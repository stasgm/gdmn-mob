import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerMap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapView: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    width: 70,
    height: 70,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  button: {
    marginTop: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  statusContainer: {
    zIndex: 2,
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width,
    height: 50,
  },
  pointName: {
    fontSize: 18,
  },
  mark: {
    backgroundColor: 'green',
  },
  myLocationMark: {
    backgroundColor: 'blue',
  },
  selectedMark: {
    backgroundColor: 'red',
  },
});

export default styles;
