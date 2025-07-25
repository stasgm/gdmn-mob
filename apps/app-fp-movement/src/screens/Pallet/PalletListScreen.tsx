import {
  globalStyles as styles,
  AddButton,
  AppScreen,
  CloseButton,
  DeleteButton,
  IListItemProps,
  navBackDrawer,
  AppActivityIndicator,
  SubTitle,
  ScreenListItem,
  ItemSeparator,
  EmptyList,
  AppDialog,
  MediumText,
} from '@lib/mobile-ui';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Keyboard, ListRenderItem, SectionList, SectionListData, TextInput, View } from 'react-native';

import { documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';

import { IDelList } from '@lib/mobile-types';

import { deleteSelectedItems, generateId, getDateString, getDelList, keyExtractor } from '@lib/mobile-hooks';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { IDocumentType, IReference } from '@lib/types';

import * as Print from 'expo-print';

import { barcodeToSvg } from '@adrianso/react-native-barcode-builder';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PalletStackParamList } from '../../navigation/Root/types';
import { barcodeSettings, IPalletDocument, IPalletHead } from '../../store/types';

import { alertWithSound, getBarcode, getBarcodeString, getLineGood, getNextDocNumber } from '../../utils/helpers';

import { ONE_SECOND_IN_MS } from '../../utils/constants';
import { IGood } from '../../store/app/types';

import { PalletDialog, print } from './components/PalletDialog';

export interface PalletListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, PalletListSectionProps>[];

export const PalletListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<PalletStackParamList, 'PalletList'>>();
  const docDispatch = useDocThunkDispatch();

  const dispatch = useDispatch();
  const storeMan = useSelector((state) => state.auth.user);

  const list = (
    useSelector((state) => state.documents.list)?.filter((i) => i.documentType?.name === 'pallet') as IPalletDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const sectionList = list.map(
    (i) =>
      ({
        id: i.id,
        title: i.head.barcode || '',
        documentDate: getDateString(i.documentDate),
        status: i.status,
        errorMessage: i.errorMessage,
        addInfo: (
          <View>
            <MediumText>{i.head.good.name || ''}</MediumText>
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} />
              <MediumText>
                {(i.head.weight || 0).toString()}кг, {(i.head.quantPack || 0).toString()} кор.
              </MediumText>
            </View>
            <MediumText>
              Партия № {i.head.numReceived || ''} от {getDateString(i.head.workDate) || ''}
            </MediumText>
          </View>
        ),
        sentDate: i.sentDate,
        erpCreationDate: i.erpCreationDate,
      }) as IListItemProps,
  );

  const palletType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'pallet');
  const [visiblePalletDialog, setVisiblePalletDialog] = useState(false);

  // const loading = useSelector((state) => state.app.loading);
  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const sections = useMemo(
    () =>
      sectionList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = item.documentDate;
        const sectionExists = prev.some(({ title }) => title === sectionTitle);
        if (sectionExists) {
          return prev.map((section) =>
            section.title === sectionTitle ? { ...section, data: [...section.data, item] } : section,
          );
        }

        return [
          ...prev,
          {
            title: sectionTitle,
            data: [item],
          },
        ];
      }, []),
    [sectionList],
  );

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      docDispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, docDispatch]);

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
    Keyboard.dismiss();
    handleFocus();
  };

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <View style={styles.buttons}>
            <DeleteButton onPress={handleDeleteDocs} />
          </View>
        ) : (
          <AddButton onPress={() => setVisibleDialog(true)} />
        )}
      </View>
    ),
    [handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `${Object.values(delList).length}` : 'Документы',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const [selectedPalletHead, setSelectedPalletHead] = useState<IPalletHead | undefined>(undefined);
  const [selectedPrinter, _] = useState<Print.Printer>();

  const handleOnPress = useCallback(
    async (id: string) => {
      const doc = list.find((i) => i.id === id);
      if (!doc || !doc?.head || !doc?.head?.barcode) {
        return;
      }

      const SVGBarcode = barcodeToSvg({
        value: doc?.head?.barcode,
        width: 500,
        height: 160,
      });

      await print(
        { ...doc?.head, storeMan: `${storeMan?.lastName} ${storeMan?.firstName}` },
        SVGBarcode,
        selectedPrinter,
      );
    },
    [list, selectedPrinter, storeMan?.firstName, storeMan?.lastName],
  );

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() => (isDelList ? setDelList(getDelList(delList, item.id, item.status!)) : handleOnPress(item.id))}
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
      />
    ),
    [delList, handleOnPress, isDelList],
  );

  const goods = refSelectors.selectByName<IGood>('good').data;

  const settings = useSelector((state) => state.settings?.data);

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;
  const maxBarcodeLength = (settings.maxBarcodeLength?.data as number) || 0;

  const ref = useRef<TextInput>(null);
  const handleFocus = () => {
    ref?.current?.focus();
  };

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanned, setScanned] = useState(false);

  const handleErrorMessage = useCallback((visible: boolean, text: string) => {
    if (visible) {
      setErrorMessage(text);
    } else {
      alertWithSound('Внимание!', `${text}.`, handleFocus);
      setScanned(false);
    }
  }, []);

  const handleAddDocument = useCallback(
    (barcodeObj: IPalletHead) => {
      if (!palletType) {
        handleErrorMessage(visibleDialog, 'Не найден тип документа!');
        return;
      }

      const newNumber = getNextDocNumber(list);

      const date = new Date().toISOString();
      const newDoc: IPalletDocument = {
        id: generateId(),
        documentType: palletType,
        // number: docNumber && docNumber.trim(),
        number: newNumber,
        documentDate: date,
        status: 'DRAFT',
        head: barcodeObj,
        lines: [],
        creationDate: date,
        editionDate: date,
      };
      dispatch(documentActions.addDocument(newDoc));
      setVisiblePalletDialog(false);
    },
    [dispatch, handleErrorMessage, list, palletType, visibleDialog],
  );

  const getScannedObject = useCallback(
    (brc: string) => {
      // if (!doc) {
      //   return;
      // }

      // if (doc?.status !== 'DRAFT') {
      //   return;
      // }

      if (!brc.match(/^-{0,1}\d+$/)) {
        handleErrorMessage(visibleDialog, 'Штрих-код не определён. Повторите сканирование!');
        return;
      }

      if (brc.length < minBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода меньше минимальной длины, указанной в настройках. Повторите сканирование!',
        );
        return;
      }

      if (brc.length > maxBarcodeLength) {
        handleErrorMessage(
          visibleDialog,
          'Длина штрих-кода больше максимальной длины, указанной в настройках. Повторите сканирование!',
        );
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const lineGood = getLineGood(barc.shcode, barc.weight, goods, [], false, goodBarcodeSettings?.countCode || 4);

      if (!lineGood.good) {
        handleErrorMessage(visibleDialog, 'Товар не найден!');
        return;
      }

      setSelectedPalletHead({ ...barc, good: lineGood.good, scannedBarcode: brc });

      if (visibleDialog) {
        setVisibleDialog(false);
        setErrorMessage('');
        setBarcode('');
      } else {
        setScanned(false);
      }

      setVisiblePalletDialog(true);
    },

    [minBarcodeLength, maxBarcodeLength, goodBarcodeSettings, goods, visibleDialog, handleErrorMessage],
  );

  const handleSearchBarcode = () => {
    getScannedObject(barcode);
  };

  const handleGetBarcode = (obj: IPalletHead) => {
    return getBarcodeString({ ...obj, shcode: obj.good.shcode }, goodBarcodeSettings);
  };

  // const viewStyle: StyleProp<ViewStyle> = useMemo(
  //   () => ({ ...styles.container, justifyContent: lineType === 'last' ? 'flex-start' : 'center' }),
  //   [lineType],
  // );

  const [key, setKey] = useState(1);

  const setScan = (brc: string) => {
    setKey(key + 1);
    setScanned(true);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (!visibleDialog && !scanned && ref?.current) {
      ref?.current &&
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, ONE_SECOND_IN_MS);
    }
  }, [scanned, ref, visibleDialog]);

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <TextInput
        style={styles.scanInput}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
      />
      <PalletDialog
        visible={visiblePalletDialog}
        onCancel={() => setVisiblePalletDialog(false)}
        onOk={handleAddDocument}
        // pallet={selectedPallet}
        storeMan={`${storeMan?.lastName} ${storeMan?.firstName}`}
        palletHead={selectedPalletHead}
        getBarcode={handleGetBarcode}
      />
      <AppDialog
        title="Введите штрих-код"
        visible={visibleDialog}
        text={barcode}
        onChangeText={setBarcode}
        onCancel={handleDismissBarcode}
        onOk={handleSearchBarcode}
        okLabel={'Найти'}
        errorMessage={errorMessage}
        keyboardType="number-pad"
      />
    </AppScreen>
  );
};
