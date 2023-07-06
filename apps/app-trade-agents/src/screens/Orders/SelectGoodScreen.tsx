import React, { useState, useLayoutEffect, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ColorValue, Alert, useWindowDimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Badge, Chip, Divider, Searchbar, useTheme } from 'react-native-paper';

import {
  globalStyles as styles,
  SearchButton,
  navBackButton,
  MediumText,
  globalColors,
  ItemSeparator,
  AppActivityIndicator,
  AppScreen,
  Switch,
} from '@lib/mobile-ui';
import { appActions, docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { generateId, getDateString, keyExtractor, shortenString } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { OrdersStackParamList } from '../../navigation/Root/types';
import {
  IGood,
  IGoodGroup,
  IGoodMatrix,
  IGroupFormParam,
  IMGroupModel,
  IOrderDocument,
  IOrderLine,
} from '../../store/types';
import { UNKNOWN_GROUP } from '../../utils/constants';
import { getGoodMatrixByContact, getGroupModelByContact } from '../../utils/helpers';

import { OrderLineDialog } from './components/OrderLineDialog';
import OrderLineEdit, { IOrderItemLine } from './components/OrderLineEdit';

const SelectGoodScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGood'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGood'>>().params;
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings.data);
  const isUseNetPrice = settings?.isUseNetPrice?.data as boolean;
  const isShowPrevOrderLines = settings?.isShowPrevOrderLines?.data as boolean;

  const [isUseMatrix, setIsUseMatrix] = useState(isUseNetPrice);
  const [isShowPrev, setIsShowPrev] = useState(false);

  const syncDate = useSelector((state) => state.app.syncDate);
  const isDemo = useSelector((state) => state.auth.isDemo);

  useEffect(() => {
    if (syncDate && getDateString(syncDate) !== getDateString(new Date()) && !isDemo) {
      return Alert.alert('Внимание!', 'В справочнике устаревшие данные, требуется синхронизация', [{ text: 'OK' }]);
    }
  }, [syncDate, isDemo]);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];
  const goods = refSelectors.selectByName<IGood>('good').data;
  const refGroup = refSelectors.selectByName<IGoodGroup>('goodGroup');
  const groups = useMemo(() => refGroup.data.concat(UNKNOWN_GROUP), [refGroup.data]);
  const doc = docSelectors.selectByDocId<IOrderDocument>(docId);
  const contactId = doc?.head.contact.id;
  const docs = useSelector((state) => state.documents.list) as IOrderDocument[];
  const prevOrderByContact = useMemo(
    () =>
      doc && isShowPrevOrderLines
        ? docs
            .filter(
              (o) =>
                o.documentType.name === 'order' &&
                o.head.contact.id === contactId &&
                o.id !== doc.id &&
                new Date(o.documentDate).getTime() < new Date(doc.documentDate).getTime(),
            )
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime())
        : [],
    [contactId, doc, isShowPrevOrderLines, docs],
  );

  const prevLines = useMemo(() => (prevOrderByContact.length ? prevOrderByContact[0].lines : []), [prevOrderByContact]);

  const { parentGroupId } = useSelector((state) => state.app.formParams as IGroupFormParam);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const windowWidth = useWindowDimensions().width;
  const groupButtonStyle = useMemo(
    () => ({
      width: windowWidth > 550 ? '23%' : '31%',
    }),
    [windowWidth],
  );

  const model = useMemo(
    () =>
      (contactId
        ? getGroupModelByContact(groups, goods, goodMatrix[contactId], isUseMatrix, isShowPrev ? prevLines : [])
        : {}) as IMGroupModel,
    [contactId, groups, goods, goodMatrix, isUseMatrix, isShowPrev, prevLines],
  );

  const firstLevelGroups = useMemo(() => Object.values(model).map((item) => item.parent), [model]);

  const [selectedParentGroup, setSelectedParentGroup] = useState<IGoodGroup | undefined>(
    parentGroupId ? groups.find((group) => group.id === parentGroupId) || firstLevelGroups[0] : firstLevelGroups[0],
  );

  const nextLevelGroups = useMemo(
    () => (selectedParentGroup ? model[selectedParentGroup.id]?.children?.map((gr) => gr.group) || [] : []),
    [selectedParentGroup, model],
  );

  const [selectedGroup, setSelectedGroup] = useState<IGoodGroup | undefined>(undefined);

  const goodModel = useMemo(
    () =>
      selectedParentGroup && selectedGroup
        ? model[selectedParentGroup.id]?.children
            ?.find((gr) => gr.group.id === selectedGroup?.id || '')
            ?.goods?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
        : [],
    [selectedGroup, selectedParentGroup, model],
  );

  const goodsByContact = useMemo(() => {
    if (contactId) {
      const goodList = getGoodMatrixByContact(goods, goodMatrix[contactId], isUseMatrix, undefined, searchQuery);
      return (isShowPrev ? goodList?.filter((g) => prevLines.some((p) => p.good.id === g.id)) : goodList)?.sort(
        (a, b) => (a.name < b.name ? -1 : 1),
      );
    } else {
      return [];
    }
  }, [contactId, goodMatrix, goods, isShowPrev, isUseMatrix, prevLines, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const [selectedLine, setSelectedLine] = useState<IOrderLine | undefined>(undefined);
  const [selectedGood, setSelectedGood] = useState<IGood | undefined>(undefined);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton
          onPress={() => {
            setFilterVisible((prev) => !prev);
          }}
          visible={filterVisible}
        />
      </View>
    ),
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const [orderLine, setOrderLine] = useState<IOrderItemLine | undefined>();

  const handleAddLine = useCallback(() => {
    if (selectedLine) {
      setOrderLine({ mode: 0, docId, item: { id: generateId(), good: selectedLine.good, quantity: 0 } });
      setSelectedLine(undefined);
    } else if (selectedGood) {
      setOrderLine({ mode: 0, docId, item: { id: generateId(), good: selectedGood, quantity: 0 } });
      setSelectedGood(undefined);
    }
  }, [selectedLine, selectedGood, docId]);

  const handleEditLine = useCallback(() => {
    if (selectedLine) {
      setOrderLine({ mode: 1, docId, item: selectedLine });
      setSelectedLine(undefined);
    }
  }, [docId, selectedLine]);

  const handleDeleteLine = useCallback(() => {
    if (selectedLine) {
      Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: selectedLine.id }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
      hadndleDismissDialog();
    } else if (selectedGood && doc) {
      const lineIds: string[] = doc.lines?.filter((i) => i.good.id === selectedGood?.id)?.map((i) => i.id);
      Alert.alert(`Вы уверены, что хотите удалить ${lineIds.length > 1 ? 'все позиции' : 'позицию'} ?`, '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocumentLines({ docId, lineIds }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
      hadndleDismissDialog();
    }
  }, [dispatch, doc, docId, selectedGood, selectedLine]);

  const hadndleDismissDialog = () => {
    setSelectedLine(undefined);
    setSelectedGood(undefined);
  };

  const { colors } = useTheme();

  const Group = useCallback(
    ({
      values,
      onPress,
      selectedGroupId,
      colorBack,
      colorSelected,
    }: {
      values: IGoodGroup[];
      onPress: (item: IGoodGroup) => void;
      selectedGroupId?: string;
      colorBack: ColorValue;
      colorSelected: ColorValue;
    }) => {
      return (
        <View style={localStyles.groupItem}>
          <View style={localStyles.flexRowWrap}>
            {values.map((item) => {
              const colorStyle = { color: item.id === selectedGroupId ? 'white' : colors.text };
              const backColorStyle = { backgroundColor: item.id === selectedGroupId ? colorSelected : colorBack };
              const badgeColor = { backgroundColor: item.decoration?.color ? item.decoration.color : 'transparent' };
              return (
                <View
                  key={item.id}
                  style={[localStyles.button, backColorStyle, styles.flexDirectionRow, groupButtonStyle]}
                >
                  <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
                    <Text style={[localStyles.buttonLabel, colorStyle]}>{shortenString(item.name, 60) || item.id}</Text>
                  </TouchableOpacity>
                  {item.decoration?.name && (
                    <Badge style={[localStyles.badge, badgeColor]} size={10}>
                      {item.decoration.name.toUpperCase()}
                    </Badge>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      );
    },
    [colors.text, groupButtonStyle],
  );

  const handlePressGood = useCallback(
    (isAdded: boolean, item: IGood) => {
      if (isAdded) {
        setSelectedGood(item);
      } else {
        const newLine = { mode: 0, docId, item: { id: generateId(), good: item, quantity: 0 } };
        setOrderLine(newLine);
      }
    },
    [docId],
  );

  const renderGood = useCallback(
    ({ item }: { item: IGood }) => {
      const lines = doc?.lines?.filter((i) => i.good.id === item.id);
      const isAdded = !!lines?.length;
      const prevLine = prevLines.filter((i) => i.good.id === item.id);
      const iconStyle = [styles.icon, { backgroundColor: isAdded ? '#06567D' : '#E91E63' }];

      const goodStyle = {
        backgroundColor: isAdded ? globalColors.backgroundLight : 'transparent',
      };

      return (
        <View key={item.id}>
          <TouchableOpacity onPress={() => handlePressGood(isAdded, item)}>
            <View style={[localStyles.goodItem, goodStyle]}>
              <View style={iconStyle}>
                <MaterialCommunityIcons name={'file-document'} size={20} color={'#FFF'} />
              </View>
              <View style={styles.details}>
                <MediumText style={styles.textBold}>{item.name || item.id}</MediumText>
                {isAdded && (
                  <View style={localStyles.lineView}>
                    {lines.map((line) => (
                      <Chip
                        key={line.id}
                        style={[localStyles.lineChip, { borderColor: colors.primary }]}
                        onPress={() => setSelectedLine(line)}
                      >
                        {line.quantity} кг, уп.: {line.package ? line.package.name : 'без упаковки'}
                      </Chip>
                    ))}
                  </View>
                )}
                {!!prevLine.length && (
                  <View style={localStyles.lineView}>
                    <MaterialCommunityIcons name={'page-previous-outline'} size={14} color={colors.placeholder} />
                    {prevLine.map((line) => (
                      <MediumText key={line.id} style={localStyles.prevText}>
                        {` ${line.quantity} кг, уп.: ${line.package ? line.package.name : 'без упаковки'};`}
                      </MediumText>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.placeholder, colors.primary, doc?.lines, handlePressGood, prevLines],
  );

  const handlePressGroup = useCallback(
    (paramName: string, item: IGoodGroup, setFunc: any) => {
      setFunc(item);
      dispatch(
        appActions.setFormParams({
          [paramName]: item?.id,
        }),
      );
    },
    [dispatch],
  );

  const renderGroupHeader = useCallback(
    () => (
      <View>
        <Group
          key={'firstLevelGroups'}
          values={firstLevelGroups}
          onPress={(item) => handlePressGroup('parentGroupId', item, setSelectedParentGroup)}
          selectedGroupId={selectedParentGroup?.id}
          colorBack={'#d5dce3'}
          colorSelected={colors.placeholder}
        />
        <Group
          key={'nextLevelGroups'}
          values={nextLevelGroups}
          onPress={(item) => handlePressGroup('groupId', item, setSelectedGroup)}
          selectedGroupId={selectedGroup?.id}
          colorBack={'#dbd5da'}
          colorSelected={'#854875'}
        />
      </View>
    ),
    [
      Group,
      colors.placeholder,
      firstLevelGroups,
      handlePressGroup,
      nextLevelGroups,
      selectedGroup?.id,
      selectedParentGroup?.id,
    ],
  );

  const hadndleDismiss = () => {
    setOrderLine(undefined);
    hadndleDismissDialog();
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen style={localStyles.container}>
      {!!orderLine && <OrderLineEdit orderLine={orderLine} onDismiss={hadndleDismiss} />}
      {filterVisible && (
        <View>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={(text) => {
                setSearchQuery(text);
              }}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={colors.primary}
            />
          </View>

          <ItemSeparator />
        </View>
      )}
      {!filterVisible && (
        <View>
          {contactId && goodMatrix[contactId] && (
            <View style={localStyles.switch}>
              <MediumText>Использовать матрицы</MediumText>
              <Switch value={isUseMatrix} onValueChange={() => setIsUseMatrix(!isUseMatrix)} />
            </View>
          )}
          {contactId && goodMatrix[contactId] && isShowPrevOrderLines && <Divider />}
          {isShowPrevOrderLines && !!prevLines.length && (
            <View style={localStyles.switch}>
              <MediumText>Предыдущая заявка</MediumText>
              <Switch value={isShowPrev} onValueChange={() => setIsShowPrev(!isShowPrev)} />
            </View>
          )}
        </View>
      )}
      <FlashList
        data={filterVisible ? goodsByContact : goodModel}
        renderItem={renderGood}
        ListHeaderComponent={filterVisible ? undefined : renderGroupHeader}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        extraData={[doc?.lines, docId]}
        keyboardShouldPersistTaps={'handled'}
      />
      {(selectedLine || selectedGood) && (
        <OrderLineDialog
          selectedLine={selectedLine}
          goodName={selectedLine?.good.name || selectedGood?.name || ''}
          onEditLine={handleEditLine}
          onAddLine={handleAddLine}
          onDeleteLine={handleDeleteLine}
          onDismissDialog={hadndleDismissDialog}
        />
      )}
    </AppScreen>
  );
};

export default SelectGoodScreen;

const localStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  groupItem: {
    marginBottom: 2,
    flex: 1,
  },
  goodItem: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 3,
    minHeight: 50,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lineView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  lineChip: {
    margin: 2,
  },
  button: {
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    margin: 3,
    textAlign: 'center',
    height: 78,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.9,
    lineHeight: 14,
    textAlignVertical: 'center',
    height: 70,
  },
  prevText: {
    fontSize: 10,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
  },
  switch: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    fontSize: 20,
    justifyContent: 'space-between',
  },
});
