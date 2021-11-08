import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IReference } from '@lib/types';

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

  const goods = refSelectors.selectByName<IGood>('good').data.filter((good) => good.goodgroup.id === item.id);
  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const groups = refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>;

  const nextLevelGroups = groups.data.filter((group) => group.parent?.id === item.id);

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
              <Text style={styles.field}>{goods.length}</Text>
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
  // const { colors } = useTheme();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;
  const dispatch = useDispatch();
  const contactId = docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact.id;

  const formParams = useSelector((state) => state.app.formParams);

  const { model } = useAppTradeSelector((state) => state.appTrade);

  const contactModel = contactId ? model[contactId] : undefined;

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const groupModel = useMemo(
    () =>
      contactModel?.reduce((prev: IGoodGroup[], cur: IGood) => {
        const group = groups.data?.find((gr) => gr.id !== cur.goodgroup.id);
        // const parent = groups.data?.find((gr) => gr.id !== cur.goodgroup.id);
        return [...prev.filter((gr) => gr.id !== cur.goodgroup.id && gr.id !== group?.parent?.id), cur.goodgroup];
      }, []) || [],
    [contactModel, groups.data],
  );

  const firstLevelGroups = groupModel.filter((item) => !item.parent);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });

    if (formParams?.groupId) {
      const expandGroup = groupModel.find((group) => group.id === formParams.groupId);
      setExpend(expandGroup);
    }

    // const getData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem(keyStore);
    //     if (value !== null) {
    //       const expandGroup = groupModel.find((group) => group.id === value);
    //       setExpend(expandGroup);
    //     }
    //   } catch (e) {
    //     // error reading value
    //   }
    // };

    // getData();
  }, [navigation, groupModel, formParams?.groupId]);

  useEffect(() => {
    // const storeData = async () => {
    //   try {
    //     expend ? await AsyncStorage.setItem(keyStore, expend.id) : await AsyncStorage.removeItem(keyStore);
    //   } catch (e) {
    //     // saving error
    //   }
    // };

    // storeData();
    dispatch(
      appActions.setFormParams({
        ...formParams,
        ['groupId']: expend?.id,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, expend?.id]);

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item }: { item: IGoodGroup }) => (
    <Group item={item} expendGroup={expend?.id} setExpend={setExpend} />
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
