import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Alert, TextInput, TouchableHighlight } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  ScanButton,
  CloseButton,
  DeleteButton,
  SendButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  ListItemLine,
  navBackButton,
  SaveDocument,
  SimpleDialog,
  SearchButton,
} from '@lib/mobile-ui';

import {
  deleteSelectedLineItems,
  getDateString,
  getDelLineList,
  useSendDocs,
  sleep,
  keyExtractor,
  generateId,
} from '@lib/mobile-hooks';

import { ISettingsOption, ScreenState } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { IWaybillDocument, IWaybillLine } from '../../store/types';
import { WaybillStackParamList } from '../../navigation/Root/types';
import { getStatusColor, lineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';
import { IGood } from '../../store/app/types';

import DocTotal from './components/WaybillTotal';
import { WaybillDialog } from './components/WaybillDialog';

export const WaybillViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<WaybillStackParamList, 'WaybillView'>>();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [searchVisible, setSearchVisible] = useState(false);

  const id = useRoute<RouteProp<WaybillStackParamList, 'WaybillView'>>().params?.id;
  const doc = docSelectors.selectByDocId<IWaybillDocument>(id);

  const loading = useSelector((state) => state.app.loading);

  const lines = useMemo(() => {
    return doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)) || [];
  }, [doc?.lines]);

  const isBlocked = doc?.status !== 'DRAFT';

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  const ref = useRef<TextInput>(null);

  const [isDateVisible, setIsDateVisible] = useState(false);

  const handleFocus = () => {
    ref?.current?.focus();
  };

  useFocusEffect(
    useCallback(() => {
      if (ref?.current) {
        ref?.current &&
          setTimeout(() => {
            ref.current?.focus();
            ref.current?.clear();
          }, ONE_SECOND_IN_MS);
      }
    }, [ref]),
  );

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('WaybillEdit', { id });
  }, [navigation, id]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }
    Alert.alert('Вы уверены, что хотите удалить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setScreenState('deleting');
          await sleep(1);
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setScreenState('deleted');
          } else {
            setScreenState('idle');
          }
        },
      },
      {
        text: 'Отмена',
        onPress: () => handleFocus(),
      },
    ]);
  }, [docDispatch, id]);

  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = !!Object.keys(delList).length;

  const handleDeleteDocs = useCallback(() => {
    const deleteDocs = () => {
      dispatch(documentActions.removeDocumentLines({ docId: id, lineIds: delList }));
      setDelList([]);
    };

    deleteSelectedLineItems(deleteDocs);
  }, [delList, dispatch, id, setDelList]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const sendDoc = useSendDocs(doc ? [doc] : []);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    setScreenState('sending');
    await sendDoc();
    setScreenState('sent');
  }, [sendDoc]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Редактировать данные',
        onPress: handleEditDocHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
        onPress: handleFocus,
      },
    ]);
  }, [showActionSheet, handleDelete, handleEditDocHead]);

  const handleSaveDocument = useCallback(() => {
    if (!doc) {
      return;
    }
    dispatch(
      documentActions.updateDocument({
        docId: id,
        document: { ...doc, status: 'READY' },
      }),
    );
    navigation.goBack();
  }, [dispatch, id, navigation, doc]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        doc?.status === 'READY' ? (
          <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
        ) : (
          doc?.status === 'DRAFT' && <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
        )
      ) : (
        <View style={styles.buttons}>
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocs} />
          ) : (
            <>
              {doc?.status === 'DRAFT' && (
                <>
                  <SearchButton onPress={() => setSearchVisible((prev) => !prev)} visible={searchVisible} />
                  <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
                </>
              )}
              <SendButton onPress={() => setVisibleSendDialog(true)} disabled={screenState !== 'idle' || loading} />
              <ScanButton
                onPress={() => (isScanerReader ? handleFocus() : handleDoScan())}
                disabled={screenState !== 'idle'}
              />

              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [
      actionsMenu,
      doc?.status,
      handleDeleteDocs,
      handleDoScan,
      handleSaveDocument,
      isBlocked,
      isDelList,
      isScanerReader,
      loading,
      screenState,
      searchVisible,
    ],
  );

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isBlocked, isDelList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: isDelList ? `Выделено позиций: ${delList.length}` : '',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const [visibleLineDialog, setVisibleLineDialog] = useState(false);
  const [selectedLine, setSelectedLine] = useState<IWaybillLine | undefined>(undefined);

  const handleDismissLineDialog = () => {
    setVisibleLineDialog(false);
    setSelectedLine(undefined);
  };

  const [lineType, setLineType] = useState(lineTypes[0].id);
  const [currentLine, setCurrentLine] = useState<IWaybillLine | undefined>(undefined);

  const handleOkLineDialog = useCallback(
    (quantity?: number) => {
      if (quantity && currentLine) {
        const newLine: IWaybillLine = {
          ...currentLine,
          checkedQuantity: quantity,
          checked: currentLine.quantity === quantity ? true : false,
        };
        dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
        setCurrentLine(newLine);
      }
      setVisibleLineDialog(false);
      setSelectedLine(undefined);
    },
    [currentLine, dispatch, id],
  );

  const LineTypes = useCallback(
    () => (
      <View style={styles.containerCenter}>
        {lineTypes.map((e, i) => {
          return (
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor="#DDDDDD"
              key={e.id}
              style={[
                styles.btnTab,
                i === 0 && styles.firstBtnTab,
                i === lineTypes.length - 1 && styles.lastBtnTab,
                e.id === lineType && { backgroundColor: colors.primary },
                { borderColor: colors.primary },
              ]}
              onPress={() => setLineType(e.id)}
              disabled={!currentLine}
            >
              <LargeText style={{ color: e.id === lineType ? colors.background : colors.text }}>{e.value}</LargeText>
            </TouchableHighlight>
          );
        })}
      </View>
    ),
    [colors.background, colors.primary, colors.text, currentLine, lineType],
  );

  const renderItem = ({ item }: { item: IWaybillLine }) => {
    const good = goods?.find((e) => e.id === item?.goodId);

    const handleOnPress = () => {
      setVisibleLineDialog(true);
      setSelectedLine({ ...item, goodId: good?.name || '' });
      setCurrentLine(item);
    };

    const lineStyle = {
      backgroundColor:
        item.checkedQuantity && item.checkedQuantity !== item.quantity
          ? 'rgba(206, 146, 222, 0.25)'
          : item.checked
            ? 'rgba(65, 177, 237, 0.25)'
            : item.added
              ? 'rgba(255, 0, 0, 0.25)'
              : 'transparent',
    };

    return (
      <View style={lineStyle}>
        <ListItemLine
          key={item.id}
          onPress={() => (isDelList ? setDelList(getDelLineList(delList, item.id)) : !isBlocked && handleOnPress())}
          onLongPress={() => !isBlocked && setDelList(getDelLineList(delList, item.id))}
          checked={delList.includes(item.id)}
        >
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{good?.name || item.description || ''}</LargeText>
            <View style={styles.directionRow}>
              {item.EID ? <MediumText>{item.EID}</MediumText> : null}
              {item.quantity ? (
                <MediumText>
                  {item.checkedQuantity || '0'} / {item.quantity}
                </MediumText>
              ) : null}
              {item.barcode ? <MediumText>{item.barcode}</MediumText> : null}
            </View>
          </View>
        </ListItemLine>
      </View>
    );
  };
  console.log('currentLine,', currentLine);
  const LineLine = useCallback(() => {
    const good = goods?.find((e) => e.id === currentLine?.goodId);
    const lineStyle = {
      backgroundColor:
        currentLine?.checkedQuantity && currentLine?.checkedQuantity !== currentLine?.quantity
          ? 'rgba(206, 146, 222, 0.25)'
          : currentLine?.checked
            ? 'rgba(65, 177, 237, 0.25)'
            : currentLine?.added
              ? 'rgba(255, 0, 0, 0.25)'
              : 'transparent',
    };
    return (
      <View style={lineStyle}>
        <ListItemLine>
          <View style={styles.details}>
            <LargeText style={styles.textBold}>{good?.name || currentLine?.description || ''}</LargeText>
            <View style={styles.directionRow}>
              {currentLine?.EID ? <MediumText>{currentLine?.EID}</MediumText> : null}
              {currentLine?.quantity ? (
                <MediumText>
                  {currentLine?.checkedQuantity || '0'} / {currentLine?.quantity}
                </MediumText>
              ) : null}
              {currentLine?.barcode ? <MediumText>{currentLine?.barcode}</MediumText> : null}
            </View>
          </View>
        </ListItemLine>
      </View>
    );
  }, [currentLine, goods]);

  const settings = useSelector((state) => state.settings?.data);

  const prefixGtin = (settings.prefixGtin as ISettingsOption<string>)?.data || '';
  const prefixISN = (settings.prefixISN as ISettingsOption<string>)?.data || '';

  const [key, setKey] = useState(1);

  console.log('doc.lines', doc?.lines);
  const getScannedObject = useCallback(
    (brc: string) => {
      if (!doc) {
        return;
      }

      if (isBlocked) {
        return;
      }

      if (!brc) {
        return;
      }
      console.log('brc', brc);

      if (brc.length === 8 || brc.length === 13) {
        const line = doc.lines.find((item) => item.barcode === brc && item.checkedQuantity !== item.quantity);
        console.log('line', line);

        if (line) {
          const newLine: IWaybillLine = {
            ...line,
            checked: line?.checkedQuantity && line?.checkedQuantity + 1 === line?.quantity ? true : false,
            checkedQuantity: line?.checkedQuantity ? line?.checkedQuantity + 1 : 1,
          };

          dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
          setCurrentLine(newLine);
          handleFocus();

          return;
        }
        Alert.alert('Внимание!', 'Позиция данным штрихкодом не найдена.', [
          {
            text: 'ОК',
          },
        ]);
        handleFocus();
      } else {
        const line = doc.lines.find((item) => JSON.parse(JSON.stringify(item.EID)) === JSON.parse(JSON.stringify(brc)));
        if (line) {
          const newLine: IWaybillLine = { ...line, checked: true };
          dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
          handleFocus();
          return;
        }

        if (!line) {
          const gtin = brc.match(RegExp(`${prefixGtin}0?\\d{13}${prefixISN}`));

          const good = goods?.find(
            (e) => gtin && (e.barcode === gtin[0].slice(2, -2) || gtin[0].slice(3, -2) === e?.barcode),
          );
          const cline = doc.lines.find(
            (item) =>
              (item.barcode === gtin?.[0].slice(2, -2) || gtin?.[0].slice(3, -2) === item?.barcode) &&
              item.checkedQuantity !== item.quantity,
          );
          if (cline) {
            const newLine: IWaybillLine = {
              ...cline,
              checked: cline?.checkedQuantity && cline?.checkedQuantity + 1 === cline?.quantity ? true : false,
              checkedQuantity: cline?.checkedQuantity ? cline?.checkedQuantity + 1 : 1,
            };

            dispatch(documentActions.updateDocumentLine({ docId: id, line: newLine }));
            setCurrentLine(newLine);
            handleFocus();

            return;
          }
          Alert.alert(
            `${good ? `${good.name}` : 'Внимание!'} `,
            'Позиция с данным кодом маркировки не найдена.  \n\nДобавить в документ?',
            [
              {
                text: 'ОК',
                onPress: () => {
                  const newLine: IWaybillLine = {
                    id: generateId(),
                    goodId: good?.id || 'unknown',
                    added: true,
                    sortOrder: (doc.lines?.length || 0) + 1,
                    EID: brc,
                  };
                  dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
                  handleFocus();
                },
              },
              {
                text: 'Отмена',
              },
            ],
          );
          handleFocus();

          return;
        }
      }
    },

    [dispatch, doc, goods, id, isBlocked, prefixGtin, prefixISN],
  );

  const setScan = (brc: string) => {
    setKey(key + 1);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const isEditable = useMemo(() => (doc ? ['DRAFT', 'READY'].includes(doc?.status) : false), [doc]);

  if (screenState === 'deleting' || screenState === 'sending') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>{screenState === 'deleting' ? 'Удаление документа...' : 'Отправка документа...'}</LargeText>
          <AppActivityIndicator style={{}} />
        </View>
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(doc.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={() => (isEditable ? handleEditDocHead() : setIsDateVisible(!isDateVisible))}
        editable={!isEditable}
        disabled={delList.length > 0}
        isBlocked={isBlocked}
      >
        <MediumText style={styles.rowCenter}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
      </InfoBlock>

      <LineTypes />
      {isScanerReader ? (
        <TextInput
          style={styles.scanInput}
          key={key}
          autoFocus={true}
          selectionColor="transparent"
          ref={ref}
          showSoftInputOnFocus={false}
          onChangeText={(text) => setScan(text)}
        />
      ) : null}
      {lineType === 'all' ? (
        <>
          <FlashList
            data={lines}
            renderItem={renderItem}
            estimatedItemSize={60}
            ItemSeparatorComponent={ItemSeparator}
            keyboardShouldPersistTaps="handled"
            keyExtractor={keyExtractor}
            extraData={[goods, delList, isDelList, isBlocked, navigation, id]}
          />
          {doc.lines?.length ? <DocTotal lineCount={doc.lines?.length || 0} /> : null}
        </>
      ) : lineType === 'last' && currentLine ? (
        <View style={styles.spaceBetween}>
          <LineLine />
        </View>
      ) : null}

      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Вы уверены, что хотите отправить документ?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
      <WaybillDialog
        visible={visibleLineDialog}
        onDismissDialog={handleDismissLineDialog}
        item={selectedLine}
        onOk={handleOkLineDialog}
      />
    </View>
  );
};
