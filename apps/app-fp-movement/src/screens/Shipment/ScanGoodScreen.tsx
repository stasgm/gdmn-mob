// import React, { useCallback, useLayoutEffect, useState } from 'react';
// import { Text } from 'react-native';

// import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

// import { AppActivityIndicator, AppDialog, globalStyles } from '@lib/mobile-ui';
// import { useSelector, refSelectors } from '@lib/store';

// import { generateId } from '@lib/mobile-app';

// import { StackNavigationProp } from '@react-navigation/stack';

// import { ShipmentStackParamList } from '../../navigation/Root/types';
// import { IShipmentLine, IShipmentDocument } from '../../store/types';

// import { IGood } from '../../store/app/types';
// import { getBarcode } from '../../utils/helpers';
// import { navBackButton } from '../../components/navigateOptions';

// import { ScanBarcode, ScanBarcodeReader } from '../../components';

// const ScanGoodScreen = () => {
//   const docId = useRoute<RouteProp<ShipmentStackParamList, 'ScanGood'>>().params?.docId;
//   const tempId = useRoute<RouteProp<ShipmentStackParamList, 'ScanGood'>>().params?.tempId;
//   const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ScanGood'>>();
//   const settings = useSelector((state) => state.settings?.data);

//   const isScanerReader = settings.scannerUse?.data;

//   const [visibleDialog, setVisibleDialog] = useState(false);
//   const [barcode, setBarcode] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: navBackButton,
//     });
//   }, [navigation]);

//   const handleSaveScannedItem = useCallback(
//     (item: IShipmentLine) => {
//       navigation.navigate('ShipmentLine', {
//         mode: 0,
//         docId,
//         item: item,
//         tempId,
//       });
//     },
//     [docId, navigation, tempId],
//   );

//   const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IShipmentDocument;

//   const goods = refSelectors.selectByName<IGood>('good').data;

//   const getScannedObject = useCallback(
//     (brc: string): IShipmentLine | undefined => {
//       const barc = getBarcode(brc);

//       const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);
//       // Находим товар из модели остатков по баркоду, если баркод не найден, то
//       //   если выбор из остатков, то undefined,
//       //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа
//       if (!good) {
//         return;
//       }

//       return {
//         good: { id: good.id, name: good.name, shcode: good.shcode },
//         id: generateId(),
//         weight: barc.weight,
//         barcode: barc.barcode,
//         workDate: barc.workDate,
//         numReceived: barc.numReceived,
//         quantPack: barc.quantPack,
//       };
//     },

//     [goods],
//   );

//   const handleGetBarcode = useCallback(
//     (brc: string) => {
//       const barc = getBarcode(brc);

//       const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

//       if (good) {
//         const barcodeItem: IShipmentLine = {
//           good: { id: good.id, name: good.name, shcode: good.shcode },
//           id: generateId(),
//           weight: barc.weight,
//           barcode: barc.barcode,
//           workDate: barc.workDate,
//           numReceived: barc.numReceived,
//           quantPack: barc.quantPack,
//         };
//         setErrorMessage('');
//         navigation.navigate('ShipmentLine', {
//           mode: 0,
//           docId: docId,
//           item: barcodeItem,
//           tempId: tempId,
//         });
//         setVisibleDialog(false);
//         setBarcode('');
//       } else {
//         setErrorMessage('Товар не найден');
//       }
//     },

//     [goods, navigation, docId, tempId],
//   );

//   const handleShowDialog = () => {
//     setVisibleDialog(true);
//   };

//   const handleSearchBarcode = () => {
//     handleGetBarcode(barcode);
//   };

//   const handleDismissBarcode = () => {
//     setVisibleDialog(false);
//     setBarcode('');
//     setErrorMessage('');
//   };

//   const isFocused = useIsFocused();
//   if (!isFocused) {
//     return <AppActivityIndicator />;
//   }

//   if (!document) {
//     return <Text style={globalStyles.title}>Документ не найден</Text>;
//   }

//   return (
//     <>
//       {isScanerReader ? (
//         <ScanBarcodeReader
//           // onSave={(item) => handleSaveScannedItem(item)}
//           onSearchBarcode={handleShowDialog}
//           getScannedObject={getScannedObject}
//         />
//       ) : (
//         <ScanBarcode
//           // onSave={(item) => handleSaveScannedItem(item)}
//           onSearchBarcode={handleShowDialog}
//           getScannedObject={getScannedObject}
//         />
//       )}
//       <AppDialog
//         visible={visibleDialog}
//         text={barcode}
//         onChangeText={setBarcode}
//         onCancel={handleDismissBarcode}
//         onOk={handleSearchBarcode}
//         okLabel={'Найти'}
//         errorMessage={errorMessage}
//       />
//     </>
//   );
// };

// export default ScanGoodScreen;
