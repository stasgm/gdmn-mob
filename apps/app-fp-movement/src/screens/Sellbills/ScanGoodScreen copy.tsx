// import React, { useCallback, useLayoutEffect, useState } from 'react';
// import { Text, View } from 'react-native';

// import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

// import { AppActivityIndicator, AppDialog, globalStyles } from '@lib/mobile-ui';
// import { useSelector, refSelectors } from '@lib/store';

// import { generateId } from '@lib/mobile-app';

// import { StackNavigationProp } from '@react-navigation/stack';

// import { SellbillStackParamList } from '../../navigation/Root/types';
// import { ISellbillLine, ISellbillDocument } from '../../store/types';

// import { IGood } from '../../store/app/types';
// import { getBarcode } from '../../utils/helpers';
// import { navBackButton } from '../../components/navigateOptions';

// import { ScanBarcode, ScanBarcodeReader } from '../../components';

// import styles from './components/ScanBarcode/styles';

// const ScanGoodScreen = () => {
//   const docId = useRoute<RouteProp<SellbillStackParamList, 'ScanGood'>>().params?.docId;
//   const tempId = useRoute<RouteProp<SellbillStackParamList, 'ScanGood'>>().params?.tempId;
//   const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'ScanGood'>>();
//   const settings = useSelector((state) => state.settings?.data);

//   const isScanerReader = settings.scannerUse?.data;

//   const [visibleDialog, setVisibleDialog] = useState(false);
//   const [barcode, setBarcode] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const [scannedObject, setScannedObject] = useState<ISellbillLine>();

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: navBackButton,
//     });
//   }, [navigation]);

//   const handleSaveScannedItem = useCallback(
//     (item: ISellbillLine) => {
//       navigation.navigate('SellbillLine', {
//         mode: 0,
//         docId,
//         item: item,
//         tempId,
//       });
//     },
//     [docId, navigation, tempId],
//   );

//   const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as ISellbillDocument;

//   const goods = refSelectors.selectByName<IGood>('good').data;

//   const getScannedObject = useCallback(
//     (brc: string): ISellbillLine | undefined => {
//       setErrorMessage('');
//       const barc = getBarcode(brc);

//       const good = goods.find((item) => item.shcode === barc.shcode);
//       // Находим товар из модели остатков по баркоду, если баркод не найден, то
//       //   если выбор из остатков, то undefined,
//       //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа
//       if (!good) {
//         setErrorMessage('Товар не найден');
//         return;
//       }

//       setScannedObject({
//         good: { id: good.id, name: good.name, shcode: good.shcode },
//         id: generateId(),
//         weight: barc.weight,
//         barcode: barc.barcode,
//         workDate: barc.workDate,
//         numReceived: barc.numReceived,
//         quantPack: barc.quantPack,
//       });

//       if (visibleDialog) {
//         setVisibleDialog(false);
//       }
//     },
//     [goods, visibleDialog],
//   );

//   const handleGetBarcode = useCallback(
//     (brc: string) => {
//       const barc = getBarcode(brc);

//       const good = goods.find((item) => item.shcode === barc.shcode);

//       if (good) {
//         const barcodeItem: ISellbillLine = {
//           good: { id: good.id, name: good.name, shcode: good.shcode },
//           id: generateId(),
//           weight: barc.weight,
//           barcode: barc.barcode,
//           workDate: barc.workDate,
//           numReceived: barc.numReceived,
//           quantPack: barc.quantPack,
//         };
//         setErrorMessage('');
//         navigation.navigate('SellbillLine', {
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

//   const ScanItem = useCallback(
//     () => (
//       <View style={styles.itemInfo}>
//         <Text style={styles.barcode}>{scannedObject?.barcode}</Text>
//         <Text style={[styles.itemName]} numberOfLines={3}>
//           {scannedObject?.good.name}
//         </Text>
//       </View>
//     ),
//     [scannedObject?.barcode, scannedObject?.good.name],
//   );

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
//           onSave={(item) => handleSaveScannedItem(item)}
//           onShowSearchDialog={handleShowDialog}
//           getScannedObject={getScannedObject}
//           scannedObject={scannedObject}
//           errorMessage={!visibleDialog ? errorMessage : ''}
//         >
//           <ScanItem />
//         </ScanBarcodeReader>
//       ) : (
//         <ScanBarcode
//           onSave={(item) => handleSaveScannedItem(item)}
//           onShowSearchDialog={handleShowDialog}
//           getScannedObject={getScannedObject}
//           scannedObject={scannedObject}
//           errorMessage={!visibleDialog ? errorMessage : ''}
//         >
//           <ScanItem />
//         </ScanBarcode>
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
