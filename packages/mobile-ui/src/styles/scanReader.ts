import { StyleSheet } from 'react-native';

export const scanReader = StyleSheet.create({
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
  buttons: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 100,
  },
  buttonsContainer: {
    margin: 10,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#0008',
    height: 100,
    justifyContent: 'center',
  },
  goodInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  goodName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#0008',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  infoContainer: {
    height: 100,
    padding: 10,
  },
  scannerContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
