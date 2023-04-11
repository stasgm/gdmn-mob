import { ColorValue, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles as styles } from '@lib/mobile-ui';
import { useTheme } from 'react-native-paper';

interface IGroup {
  title: string;
  values: string[];
  onPress: (item: string) => void;
  colorBack: ColorValue;
  colorSelected: ColorValue;
  selected?: string;
  heightBtn?: number;
  widthBtn?: number;
}

const GroupItem = ({
  item,
  selected,
  colorSelected,
  colorBack,
  heightBtn,
  widthBtn,
  onPress,
}: {
  item: string;
  colorSelected: ColorValue;
  colorBack: ColorValue;
  heightBtn: number;
  widthBtn: number;
  onPress: (item: string) => void;
  selected?: string;
}) => {
  const { colors } = useTheme();
  const colorStyle = { color: selected === item ? 'white' : colors.text };
  const backColorStyle = { backgroundColor: selected === item ? colorSelected : colorBack };
  return (
    <TouchableOpacity
      key={item}
      style={[localStyles.button, backColorStyle, { height: heightBtn, width: widthBtn }]}
      onPress={() => onPress(item)}
    >
      <Text style={[localStyles.buttonLabel, colorStyle]}>{item}</Text>
    </TouchableOpacity>
  );
};

export const Group = ({
  values,
  onPress,
  selected,
  colorBack,
  colorSelected,
  title,
  heightBtn = 50,
  widthBtn = 50,
}: IGroup) => {
  return (
    <View style={styles.flexDirectionRow}>
      <View style={localStyles.titleView}>
        <Text style={localStyles.title}>{title}</Text>
      </View>
      <View style={[localStyles.flexRowWrap, localStyles.flex]}>
        {values.map((item) => (
          <GroupItem
            key={item}
            item={item}
            selected={selected}
            colorSelected={colorSelected}
            colorBack={colorBack}
            heightBtn={heightBtn}
            widthBtn={widthBtn}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  button: {
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    margin: 3,
    textAlign: 'center',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.9,
    lineHeight: 14,
    textAlignVertical: 'center',
    height: 70,
  },
  title: {
    transform: [{ rotate: '270deg' }],
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleView: {
    width: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});
