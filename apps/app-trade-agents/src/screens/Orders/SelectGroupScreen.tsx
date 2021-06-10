import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodGroup } from '../../store/docs/types';

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
  const navigation = useNavigation();

  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const goods = (refSelectors.selectByName('good') as IReference<IGood>).data.filter(
    (good) => good.goodgroup.id === item.id,
  );
  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const groups = refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>;

  const nextLevelGroups = groups.data.filter((group) => group.parent?.id === item.id);

  const isExpand =
    expendGroup && expendGroup === item.id && !!nextLevelGroups.find((group) => group.id === expendGroup);

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
  const { colors } = useTheme();

  const groups = refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>;

  const firstLevelGroups = groups.data.filter((item) => !item.parent);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation, colors.card]);

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item }: { item: IGoodGroup }) => (
    <Group item={item} expendGroup={expend?.id} setExpend={setExpend} />
  );

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{groups.name}</SubTitle>
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

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 20,
  },
});

export default SelectGroupScreen;
