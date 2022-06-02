import { StyleSheet } from 'react-native';

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
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.3)',
    width: 70,
    height: 70,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    // elevation: 7,
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
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    height: 55,
  },
  statusContainerError: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 48,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    height: 60,
    marginTop: 10,
  },
  pointName: {
    textAlign: 'center',
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
  routeName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outletName: {
    textAlign: 'center',
    fontSize: 16,
  },
  routeError: {
    textAlign: 'center',
    fontSize: 16,
  },
  routeIcon: {
    textAlign: 'center',
  },
  routeWidth: {
    width: '80%',
  },
});

export default styles;
