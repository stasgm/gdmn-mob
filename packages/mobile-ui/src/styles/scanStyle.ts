import { StyleSheet } from 'react-native';

export const scanStyle = StyleSheet.create({
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
  border: {
    height: 50,
    width: 50,
  },
  borderBottom: {
    borderBottomColor: '#FF8',
    borderBottomWidth: 2,
  },
  borderLeft: {
    borderLeftColor: '#FF8',
    borderLeftWidth: 2,
  },
  borderRight: {
    borderRightColor: '#FF8',
    borderRightWidth: 2,
  },
  borderTop: {
    borderTopColor: '#FF8',
    borderTopWidth: 2,
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
    paddingHorizontal: 50,
    paddingTop: 30,
  },
  infoContainer: {
    height: 100,
    padding: 10,
  },
  scannerContainer: {
    flex: 1,
    flexGrow: 1,
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
  notScannedContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notScannedHeader: {
    width: '70%',
    height: '50%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  notScannedFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnReScan: {
    backgroundColor: '#d9b227',
  },
  btnNotFind: {
    backgroundColor: '#CC3C4D',
  },
  btnFind: {
    backgroundColor: '#4380D3',
  },
  btnUnknown: {
    backgroundColor: '#CC3C4D',
  },
});
