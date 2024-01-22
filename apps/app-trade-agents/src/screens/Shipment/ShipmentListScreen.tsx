import { generateId, getDateString, keyExtractor } from '@lib/mobile-hooks';
import { IListItem } from '@lib/mobile-types';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  Menu,
  navBackDrawer,
  SelectableInput,
  PrimeButton,
  FilterButton,
} from '@lib/mobile-ui';
import { appActions, docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IDocumentType, IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionListData, View, StyleSheet, Keyboard, Platform, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ShipmentStackParamList } from '../../navigation/Root/types';
import {
  IContact,
  IContactData,
  IDebt,
  IGood,
  IShipmentListItem,
  IOrderDocument,
  IOrderLine,
  IOutlet,
  IShipmentHead,
  IShipmentLinesRef,
  IShipmentListFormParam,
} from '../../store/types';
import { shipments } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';

import ShipmentItem from './components/ShipmentItem';

export type RefListItem = IReference & { refName: string };

export interface ShipmentListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IDebt, ShipmentListSectionProps>[];

const ShipmentListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentList'>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [visibleShipment, setVisibleShipment] = useState(false);

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const syncDate = useSelector((state) => state.app.syncDate);
  const isDemo = useSelector((state) => state.auth.isDemo);
  useEffect(() => {
    if (syncDate && getDateString(syncDate) !== getDateString(new Date()) && !isDemo) {
      return Alert.alert('Внимание!', 'В справочнике устаревшие данные, требуется синхронизация', [{ text: 'OK' }]);
    }
  }, [syncDate, isDemo]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const contacts = refSelectors.selectByName<IContact>('contact')?.data;
  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');
  const orderType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data?.find((t) => t.name === 'order');

  const shipmentInfo = refSelectors.selectByName<IShipmentHead>('shipmentHead')?.data;
  const shipmentDetails: IShipmentLinesRef = refSelectors.selectByName<IShipmentLinesRef>('shipmentDetail')?.data?.[0];

  const [shipment, setShipment] = useState(shipments[0]);

  const {
    filterShipmentContact,
    filterShipmentOutlet,
    filterShipmentDateBegin,
    filterShipmentDateEnd,
    filterShipmentGood,
  } = useSelector((state) => state.app.formParams as IShipmentListFormParam);

  const filteredShipmentDetails = useMemo(
    () =>
      shipmentDetails
        ? Object.entries(shipmentDetails).reduce((prev: IShipmentLinesRef, [orderId, lines]) => {
            const cur = lines?.filter(
              (i) =>
                (shipment.id === 'shipment' ? true : i.diff < 0) &&
                (filterShipmentGood ? filterShipmentGood.find((g) => g.id === i.goodId) : true),
            );

            if (cur.length > 0) {
              prev[orderId] = cur;
            }

            return prev;
          }, {})
        : {},

    [filterShipmentGood, shipment.id, shipmentDetails],
  );

  const filteredShipmentInfo = useMemo(
    () =>
      shipmentInfo?.filter(
        (i) =>
          (shipment.id === 'shipment' ? true : filteredShipmentDetails[i.id]) &&
          filteredShipmentDetails[i.id] &&
          (filterShipmentContact?.id ? i.contactId === filterShipmentContact.id : true) &&
          (filterShipmentOutlet?.id ? i.outletId === filterShipmentOutlet.id : true) &&
          (filterShipmentDateBegin
            ? new Date(filterShipmentDateBegin).getTime() <= new Date(i.documentDate.slice(0, 10)).getTime()
            : true) &&
          (filterShipmentDateEnd
            ? new Date(filterShipmentDateEnd).getTime() >= new Date(i.documentDate.slice(0, 10)).getTime()
            : true),
      ) || [],
    [
      filterShipmentContact?.id,
      filterShipmentDateBegin,
      filterShipmentDateEnd,
      filterShipmentOutlet?.id,
      filteredShipmentDetails,
      shipment.id,
      shipmentInfo,
    ],
  );

  const list: IContactData = filteredShipmentInfo.reduce((prev: IContactData, cur: IShipmentHead) => {
    const contact = prev[cur.contactId];
    if (!contact) {
      prev[cur?.contactId] = {};
      prev[cur.contactId][cur.outletId] = {};
      prev[cur.contactId][cur.outletId][cur.id] = filteredShipmentDetails[cur.id];
    } else {
      const outlet = contact[cur.outletId];

      if (!outlet) {
        prev[cur.contactId][cur.outletId] = {};
      }
      prev[cur.contactId][cur.outletId][cur.id] = filteredShipmentDetails[cur.id];
    }

    return prev;
  }, {});

  const filteredList: IShipmentListItem[] = Object.entries(list).reduce(
    (prev: IShipmentListItem[], [contactId, contactData]) => {
      const contact = contacts?.find((i) => i.id === contactId);

      if (contact) {
        const contactLine: IShipmentListItem = {
          id: generateId(),
          lineId: contact?.id,
          name: contact?.name,
          type: 'contact',
        };
        prev = [...prev, contactLine];

        const outletLines: IShipmentListItem[] = Object.entries(contactData).reduce(
          (outletList: IShipmentListItem[], [outletId, outletData]) => {
            const outlet = outlets?.find((i) => i.id === outletId);

            if (outlet) {
              const outletLine: IShipmentListItem = {
                id: generateId(),
                lineId: outlet?.id,
                name: `${outlet?.name}, ${outlet.address}`,
                type: 'outlet',
              };
              outletList = [...outletList, outletLine];
            }

            const orderLines: IShipmentListItem[] = Object.entries(outletData).reduce(
              (orderList: IShipmentListItem[], [orderId, orderData]) => {
                const refOrder = shipmentInfo?.find((i) => i.id === orderId);

                const order = orders?.find((i) => i.id === refOrder?.orderId);

                const orderLine: IShipmentListItem = {
                  id: generateId(),
                  lineId: orderId,
                  name: `Заявка №${refOrder?.number || '-'} ${order?.number ? `(${order?.number}) ` : ''}от ${
                    refOrder?.documentDate ? getDateString(refOrder?.documentDate) : '-'
                  }`,
                  type: 'order',
                };
                orderList = [...orderList, orderLine];

                const goodList = orderData.reduce(
                  (p, c) => {
                    const good = goods?.find((i) => i.id === c.goodId);

                    const goodLine: IShipmentListItem = {
                      id: generateId(),
                      lineId: good?.id || '',
                      name: good?.name || '',
                      orderQ: c.orderQ,
                      sellQ: c.sellQ,
                      diff: c.diff,
                      type: 'good',
                    };
                    p.goodLines = [...p.goodLines, goodLine];
                    p.total = {
                      orderQ: p.total.orderQ + goodLine.orderQ,
                      sellQ: p.total.sellQ + goodLine.sellQ,
                      diff: p.total.diff + goodLine.diff,
                    };
                    return p;
                  },
                  { goodLines: [] as IShipmentListItem[], total: { orderQ: 0, sellQ: 0, diff: 0 } },
                );

                orderList = [
                  ...orderList,
                  ...goodList.goodLines,
                  {
                    ...goodList.total,
                    id: generateId(),
                    name: `Итого по заявке №${refOrder?.number || '-'} (${order?.number || '-'}) от ${
                      refOrder?.documentDate ? getDateString(refOrder?.documentDate) : '-'
                    }`,
                    type: 'total',
                  },
                ];
                return orderList;
              },
              [],
            );
            outletList = [...outletList, ...orderLines];
            return outletList;
          },
          [],
        );

        prev = [...prev, ...outletLines];
      }

      return prev;
    },
    [],
  );

  const handleCleanFormParams = useCallback(() => {
    dispatch(
      appActions.setFormParams({
        filterShipmentContact: undefined,
        filterShipmentOutlet: undefined,
        filterShipmentGood: undefined,
        filterShipmentDateBegin: '',
        filterShipmentDateEnd: '',
      }),
    );
  }, [dispatch]);

  const handleAddOrder = useCallback(
    (orderId?: string) => {
      if (orderId) {
        const docId = generateId();
        // const docId = !id ? generateId() : id;
        const newOrderDate = new Date().toISOString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const newOnDate = tomorrow.toISOString();
        const newNumber = getNextDocNumber(orders);

        const head = shipmentInfo?.find((i) => i.id === orderId);
        const contact = contacts?.find((i) => i.id === head?.contactId);
        const outlet = outlets?.find((i) => i.id === head?.outletId);

        const lines =
          shipmentDetails[orderId]
            ?.filter((i) => i.diff < 0)
            ?.reduce((prev: IOrderLine[], cur) => {
              const good = goods?.find((e) => e.id === cur.goodId);

              if (good) {
                const line: IOrderLine = {
                  id: generateId(),
                  good: good,
                  quantity: Math.abs(cur.diff),
                };
                prev = [...prev, line];
              }
              return prev;
            }, []) || [];

        if (contact && outlet && orderType) {
          const newOrder: IOrderDocument = {
            id: docId,
            documentType: orderType,
            number: newNumber,
            documentDate: newOrderDate,
            status: 'DRAFT',
            head: {
              contact: contact,
              onDate: newOnDate,
              outlet: outlet,
              comment: '',
            },
            lines,
            creationDate: newOrderDate,
            editionDate: newOrderDate,
          };
          dispatch(documentActions.addDocument(newOrder));
          navigation.navigate('OrderView', { id: newOrder.id });
        }
      }
    },
    [contacts, dispatch, goods, navigation, orderType, orders, outlets, shipmentDetails, shipmentInfo],
  );

  const outlet = outlets?.find((e) => e.id === filterShipmentOutlet?.id);

  useEffect(() => {
    if (!!filterShipmentContact && !!filterShipmentOutlet && filterShipmentContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          filterShipmentOutlet: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterShipmentContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    handleCleanFormParams();
  }, [handleCleanFormParams]);

  const withParams =
    !!filterShipmentContact ||
    !!filterShipmentOutlet ||
    !!filterShipmentGood ||
    !!filterShipmentDateBegin ||
    !!filterShipmentDateEnd;

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => <FilterButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = useCallback(
    ({ item }: { item: IShipmentListItem }) => <ShipmentItem item={item} onPress={() => handleAddOrder(item.lineId)} />,
    [handleAddOrder],
  );

  const handleSearchContact = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'filterShipmentContact',
      value: filterShipmentContact && [filterShipmentContact],
    });
  }, [filterShipmentContact, navigation]);

  const handleSearchOutlet = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'filterShipmentOutlet',
      clause: filterShipmentContact?.id
        ? {
            companyId: filterShipmentContact?.id,
          }
        : undefined,
      value: filterShipmentOutlet && [filterShipmentOutlet],
      descrFieldName: 'address',
    });
  }, [filterShipmentContact?.id, filterShipmentOutlet, navigation]);

  const handleSearchGood = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'good',
      fieldName: 'filterShipmentGood',
      isMulti: true,
      value: filterShipmentGood,
    });
  }, [filterShipmentGood, navigation]);

  const [showDateBegin, setShowDateBegin] = useState(false);

  const handleApplyDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowDateBegin(false);

    if (selectedDateBegin && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterShipmentDateBegin: selectedDateBegin.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDateBegin = () => {
    Keyboard.dismiss();
    setShowDateBegin(true);
  };

  const [showDateEnd, setShowDateEnd] = useState(false);

  const handleApplyDateEnd = (_event: any, selectedDateEnd: Date | undefined) => {
    setShowDateEnd(false);

    if (selectedDateEnd && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterShipmentDateEnd: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDateEnd = () => {
    Keyboard.dismiss();
    setShowDateEnd(true);
  };

  const handleShipment = useCallback(
    (option: IListItem) => {
      if (!(option.id === shipment?.id)) {
        setShipment(option);
      }
      setVisibleShipment(false);
    },
    [shipment?.id],
  );

  const handlePressShipment = () => {
    setVisibleShipment(true);
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen style={styles.contentTop}>
      <Divider />
      {filterVisible ? (
        <View style={[localStyles.filter, { borderColor: colors.primary }]}>
          <View style={localStyles.report}>
            <Menu
              key={'shipment'}
              options={shipments}
              onChange={handleShipment}
              onPress={handlePressShipment}
              onDismiss={() => setVisibleShipment(false)}
              title={shipment?.value || ''}
              visible={visibleShipment}
              activeOptionId={shipment?.id}
              style={localStyles.btnTab}
              iconName={'chevron-down'}
            />
          </View>
          <SelectableInput
            label="Организация"
            value={filterShipmentContact?.name || ''}
            onPress={handleSearchContact}
          />
          <View style={localStyles.marginTop}>
            <SelectableInput label="Магазин" value={filterShipmentOutlet?.name || ''} onPress={handleSearchOutlet} />
          </View>
          <View style={localStyles.marginTop}>
            <SelectableInput
              label="Товары"
              value={filterShipmentGood?.map((g) => g.name).join(',')}
              onPress={handleSearchGood}
            />
          </View>
          <View style={[styles.flexDirectionRow, localStyles.marginTop]}>
            <View style={localStyles.width}>
              <SelectableInput
                label="С даты"
                value={filterShipmentDateBegin ? getDateString(filterShipmentDateBegin) : ''}
                onPress={handlePresentDateBegin}
                style={!filterShipmentDateBegin && localStyles.fontSize}
              />
            </View>
            <View style={localStyles.width}>
              <SelectableInput
                label="По дату"
                value={filterShipmentDateEnd ? getDateString(filterShipmentDateEnd || '') : ''}
                onPress={handlePresentDateEnd}
                style={[!filterShipmentDateEnd && localStyles.fontSize, localStyles.marginInput]}
              />
            </View>
          </View>

          <View style={localStyles.container}>
            <PrimeButton icon={'delete-outline'} onPress={handleCleanFormParams} disabled={!withParams}>
              {'Очистить'}
            </PrimeButton>
          </View>
        </View>
      ) : (
        <View style={localStyles.report}>
          <Menu
            key={'shipment'}
            options={shipments}
            onChange={handleShipment}
            onPress={handlePressShipment}
            onDismiss={() => setVisibleShipment(false)}
            title={shipment?.value || ''}
            visible={visibleShipment}
            activeOptionId={shipment?.id}
            style={localStyles.btnTab}
            iconName={'chevron-down'}
          />
        </View>
      )}

      <FlashList
        data={filteredList}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
        ListEmptyComponent={EmptyList}
      />

      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterShipmentDateBegin || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}
      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterShipmentDateEnd || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateEnd}
        />
      )}
    </AppScreen>
  );
};

export default ShipmentListScreen;

const localStyles = StyleSheet.create({
  filter: {
    paddingTop: 5,
    marginVertical: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
  marginTop: {
    marginTop: -5,
  },
  width: {
    width: '50%',
  },
  fontSize: {
    fontSize: 14,
  },
  marginInput: {
    marginLeft: 5,
  },
  container: {
    alignItems: 'center',
    marginTop: -4,
  },
  report: {
    marginRight: 12,
  },
  btnTab: {
    alignItems: 'flex-end',
  },
});
