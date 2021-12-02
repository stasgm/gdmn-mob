/* import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { scanReader } from '@lib/mobile-ui/src/styles/scanReader';

import { IRem, IWeightCodeSettings, IMDGoodRemain, IModelData } from '../../store/types';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { useAppStore } from '../../store/app/store';

const oneSecund = 1000;

type Props = StackScreenProps<InventorysStackParamList, 'ScanBarcodeReader'>;

type ScannedObject = IRem & { quantity: number };
type ScannedObjectUnd = ScannedObject | undefined;
 */
/* export const ScanBarcodeReaderScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const [scanned, setScanned] = useState(false);
  const { state } = useAppStore();
  const [vibroMode, setVibroMode] = useState(false);

  const ref = useRef<TextInput>(null);

  const [barcode, setBarcode] = useState('');
  const [goodItem, setGoodItem] = useState<ScannedObjectUnd>(undefined);

  const docId = route.params?.docId;

  const document = useMemo(
    () => state.documents?.find((item: { id: number }) => item.id === docId),
    [docId, state.documents],
  );

  const weightCodeSettings = useMemo(
    () => state.companySettings?.weightSettings as unknown as IWeightCodeSettings,
    [state.companySettings?.weightSettings],
  );

  const remainsData = state.models?.remains?.data as unknown as IModelData<IMDGoodRemain>;
  const goods = remainsData?.[document?.head?.fromcontactId]?.goods;

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref.current.focus();
      ref.current.clear();
    }
  }, [scanned, ref]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setGoodItem(undefined);
      return;
    }

    const getScannedObject = (brc: string): ScannedObjectUnd => {
      let charFrom = 0;

      let charTo = weightCodeSettings?.weightCode.length;

      if (brc.substring(charFrom, charTo) !== weightCodeSettings?.weightCode) {
        const currIndexGood = Object.keys(goods).find((item) => goods[item].barcode === brc);
        if (!currIndexGood) {
          return;
        }
        const remItem = goods?.[currIndexGood];

        if (!remItem) {
          return;
        }

        const { remains, ...good } = remItem;

        return {
          goodkey: good.id,
          ...good,
          quantity: 1,
          price: remains.length ? remains[0].price : 0,
          remains: remains.length ? remains?.[0].q : 0,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.code;
      const code = Number(barcode.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.weight; */

      /* const qty = Number(barcode.substring(charFrom, charTo)) / 1000;

      const currIndexGood = Object.keys(goods).find((item) => goods[item].barcode === code);
      if (currIndexGood === undefined) {
        return;
      }
      const remItem = goods?.[currIndexGood];

      if (!remItem) {
        return;
      }

      const { remains, ...good } = remItem;

      return {
        goodkey: good.id,
        ...good,
        quantity: qty,
        price: remains.length ? remains[0].price : 0,
        remains: remains.length ? remains?.[0].q : 0,
      };
    };

    vibroMode && Vibration.vibrate(oneSecund);

    const scannedObj: ScannedObjectUnd = getScannedObject(barcode);

    setGoodItem(scannedObj);
  }, [
    barcode,
    scanned,
    vibroMode,
    weightCodeSettings?.weightCode,
    weightCodeSettings?.code,
    weightCodeSettings?.weight,
    goods,
    goodItem?.id,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[scanReader.content, { backgroundColor: colors.card }]}
    >
       <View >
      <View style={scanReader.camera}>
        <View style={scanReader.header}>
          <IconButton
            icon="arrow-left"
            color={'#FFF'}
            size={30}
            style={scanReader.transparent}
            onPress={() => navigation.goBack()}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={() => navigation.navigate('RemainsList', { docId: document?.id })}
          />
        </View>
        {!scanned ? (
          <View style={[scanReader.scannerContainer, { alignItems: 'center' }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{ width: 0 }}
                autoFocus={true}
                ref={ref}
                showSoftInputOnFocus={false}
                onChangeText={(text) => handleBarCodeScanned(text)}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={scanReader.scannerContainer}>
            <View style={scanReader.buttonsContainer}>
              <TouchableOpacity
                style={[scanReader.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={scanReader.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !goodItem && (
              <View style={scanReader.infoContainer}>
                <View style={[scanReader.buttons, { backgroundColor: '#CC3C4D' }]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={scanReader.text}>{barcode}</Text>
                    <Text style={scanReader.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )} */
            /* {scanned && goodItem && (
              <View style={scanReader.buttonsContainer}>
                <TouchableOpacity
                  style={[scanReader.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    navigation.navigate('InventoryLineEdit', {
                      prodId: goodItem.id,
                      docId,
                      price: goodItem.price,
                      remains: goodItem.remains,
                      quantity: goodItem.quantity,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanReader.goodInfo}>
                    <Text style={scanReader.goodName} numberOfLines={3}>
                      {goodItem?.name}
                    </Text>
                    <Text style={scanReader.barcode}>
                      цена: {goodItem?.price || 0}, кол-во: {goodItem?.quantity}
                    </Text>
                    <Text style={scanReader.barcode}>{goodItem?.barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanReader.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={scanReader.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
 */
