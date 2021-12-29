import React, { useState, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodGroup, IOrderDocument } from '../../store/types';
import { useSelector as useAppTradeSelector } from '../../store/';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const Group = ({
  item,
  expendGroup,
  setExpend,
}: {
  item: IGoodGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const contactId =
    docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact?.id || -1;

  const goodModel = useAppTradeSelector((state) => state.appTrade.goodModel);

  const goods = goodModel[contactId]?.goods || {};

  const groupsModel = goods[item.parent?.id || item.id];

  const goodsObj = groupsModel[item.id];

  const goodCount = goodsObj ? Object.values(goodsObj).length : 0;

  const nextLevelGroups = groups.data.filter((group) => group.parent?.id === item.id && groupsModel[group.id]);

  const isExpand = expendGroup === item.id || !!nextLevelGroups.find((group) => group.id === expendGroup);

  const icon = (nextLevelGroups.length === 0 ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon;

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ group }: { group: IGoodGroup }) => (
    <Group key={group.id} item={group} expendGroup={expendGroup} setExpend={setExpend} />
  );

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          nextLevelGroups.length > 0
            ? setExpend(!isExpand ? item : undefined)
            : navigation.navigate('SelectGoodItem', {
                docId,
                groupId: item.id,
              })
        }
      >
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          {nextLevelGroups.length === 0 && (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
              <Text style={styles.field}>{goodCount}</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name={icon} size={24} color="black" />
      </TouchableOpacity>
      {isExpand && (
        <View style={localStyles.marginLeft}>
          {nextLevelGroups.length > 0 && (
            <FlatList
              ref={refListGroups}
              data={nextLevelGroups}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item: group }) => renderGroup({ group })}
              ItemSeparatorComponent={ItemSeparator}
              ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
            />
          )}
        </View>
      )}
    </>
  );
};

const SelectGroupScreen = () => {
  const navigation = useNavigation();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;
  const dispatch = useDispatch();
  const contact = docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact;

  const formParams = useSelector((state) => state.app.formParams);

  const goodModel = useAppTradeSelector((state) => state.appTrade.goodModel);

  const groupsModel = contact?.id ? goodModel[contact.id]?.goods || {} : {};

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const firstLevelGroups = groups.data?.filter(
    (item) => !item.parent && Object.keys(groupsModel[item.id] || []).length > 0,
  );

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });

    if (formParams?.groupId) {
      const expandGroup = groups.data.find((group) => group.id === formParams.groupId);
      setExpend(expandGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, formParams?.groupId]);

  const handleSetExpand = (group: IGoodGroup | undefined) => {
    setExpend(group);
    dispatch(
      appActions.setFormParams({
        ...formParams,
        ['groupId']: group?.id,
      }),
    );
  };

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item }: { item: IGoodGroup }) => (
    <Group item={item} expendGroup={expend?.id} setExpend={(group) => handleSetExpand(group)} />
  );

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{groups.description || groups.name}</SubTitle>
      <Divider />
      <FlatList
        ref={refListGroups}
        data={firstLevelGroups}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderGroup}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
      />
    </AppScreen>
  );
};

export default SelectGroupScreen;

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 20,
  },
});
