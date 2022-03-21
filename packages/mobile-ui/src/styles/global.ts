import { StyleSheet } from 'react-native';

import colors from './colors';

const globalStyles = StyleSheet.create({
  contentTop: {
    justifyContent: 'flex-start',
  },
  bottomButtons: {
    alignItems: 'flex-end',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
  },
  btnTab: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.5,
    height: 40,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
  },
  firstBtnTab: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  lastBtnTab: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
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
  fabAdd: {
    margin: 20,
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
  },
  containerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    height: 50,
    marginTop: 15,
  },
  rectangularButton: {
    alignSelf: 'stretch',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    margin: 10,
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
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexGrow: {
    flexGrow: 10,
  },
  sectionTitle: { backgroundColor: '#ddd', paddingVertical: 5 },
  header: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  rightAlignmentSelf: {
    alignSelf: 'flex-end',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 3,
  },
  itemNoMargin: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  textDescription: {
    fontSize: 12,
    textAlign: 'right',
  },
  field: {
    opacity: 0.5,
  },
  lightText: {
    fontSize: 15,
    color: '#fff',
  },
  textTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    margin: 6,
  },
  bottomTotal: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  colorRed: {
    color: '#e91e63',
  },
  marginBottom5: {
    marginBottom: 5,
  },
  barcode: {
    alignItems: 'flex-end',
  },
  textDescriptionLeft: {
    fontSize: 5,
    textAlign: 'left',
  },
});

export default globalStyles;
