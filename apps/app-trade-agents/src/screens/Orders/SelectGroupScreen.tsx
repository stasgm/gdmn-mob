import React, { useState, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodGroup, IGoodMatrix, IOrderDocument } from '../../store/types';
import { useSelector as useAppTradeSelector } from '../../store/';
import { getGroupModelByContact } from '../../utils/helpers';
import { IMGroup } from '../../store/app/types';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const Group = ({
  item,
  expendGroup,
  setExpend,
}: {
  item: IGoodGroup | IMGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data);

  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const contactId =
    docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact?.id || -1;

  // const goodModel = useAppTradeSelector((state) => state.appTrade.goodModel);

  // const onDate = goodModel[contactId].onDate;

  // const goods = new Date(onDate).toDateString() === new Date().toDateString() ? goodModel[contactId].goods : {};

  // const groupsModel = goods[item.parent?.id || item.id];

  const newGoodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const newGoods = refSelectors.selectByName<IGood>('good').data;

  const newGroups = refSelectors.selectByName<IGoodGroup>('goodGroup').data;

  const model = getGroupModelByContact(newGroups, newGoods, newGoodMatrix[contactId]);
  // console.log('model', model);

  // const goodsObj = groupsModel[item.id];

  // const goodCount = goodsObj ? Object.values(goodsObj).length : 0;

  // const nextLevelGroups = groups.data.filter((group) => group.parent?.id === item.id && groupsModel[group.id]);

  const nextLevelGroups111 = model[item.id]?.children;

  console.log('11', nextLevelGroups111);
  // const nextLevelGroups11 = Object.values(model).filter((i) => i.parent.id === item?.id);
  // //.filter((i) => i[1].parent.id === item?.id);

  // console.log('nextLevelGroups11', nextLevelGroups11);

  // const nextLevelGroups1 = nextLevelGroups11?.map((i) => {
  //   return i.children;
  // })[0];

  console.log('nextLevelGroups', nextLevelGroups111);

  const isExpand =
    expendGroup === (item.id || item.group.id) ||
    !!nextLevelGroups111?.find((group) => group?.group.id === expendGroup);

  const icon = (nextLevelGroups111?.length === 0 ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon;

  const refListGroups = React.useRef<FlatList<IMGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ group }: { group: IGoodGroup | IMGroup }) => (
    <Group key={group?.id} item={group} expendGroup={expendGroup} setExpend={setExpend} />
  );

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          nextLevelGroups111?.length && nextLevelGroups111?.length > 0
            ? setExpend(!isExpand ? item : undefined)
            : navigation.navigate('SelectGoodItem', {
                docId,
                groupId: item.group.id,
              })
        }
      >
        <View style={styles.details}>
          <Text style={styles.name}>{item.name || item.group.name}</Text>
          {nextLevelGroups111?.length === 0 && (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
              <Text style={styles.field}>{item.goodCount}</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name={icon} size={24} color="black" />
      </TouchableOpacity>
      {isExpand && (
        <View style={localStyles.marginLeft}>
          {nextLevelGroups111 && nextLevelGroups111?.length > 0 && (
            <FlatList
              ref={refListGroups}
              data={nextLevelGroups111}
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
  const contactId =
    docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact.id || -1;

  const formParams = useSelector((state) => state.app.formParams);

  // const goodModel = useAppTradeSelector((state) => state.appTrade.goodModel);

  // const onDate = goodModel[contactId].onDate;

  // const goods = new Date(onDate).toDateString() === new Date().toDateString() ? goodModel[contactId].goods : {};

  // const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const newGoodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const newGoods = refSelectors.selectByName<IGood>('good').data;

  const newGroups1 = refSelectors.selectByName<IGoodGroup>('goodGroup');
  const newGroups = refSelectors.selectByName<IGoodGroup>('goodGroup').data;

  const model = getGroupModelByContact(newGroups, newGoods, newGoodMatrix[contactId]);
  console.log('model', model);

  // const firstLevelGroups = groups.data?.filter((item) => !item.parent && Object.keys(goods[item.id] || []).length > 0);
  const firstLevelGroups1 = Object.values(model).map((item) => {
    return item.parent;
  });

  console.log('firstLevelGroups', firstLevelGroups1);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups1[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });

    if (formParams?.groupId) {
      const expandGroup = newGroups1.data.find((group) => group.id === formParams.groupId);
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

  const renderGroup = ({ item }: { item: IGoodGroup }) => {
    console.log('123', item);
    return <Group item={item} expendGroup={expend?.id} setExpend={(group) => handleSetExpand(group)} />;
  };
  return (
    <AppScreen>
      <SubTitle style={styles.title}>{newGroups1.description || newGroups1.name}</SubTitle>
      <Divider />
      <FlatList
        ref={refListGroups}
        data={firstLevelGroups1}
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
