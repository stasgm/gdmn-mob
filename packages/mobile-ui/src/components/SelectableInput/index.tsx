import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import { RenderProps } from 'react-native-paper/lib/typescript/components/TextInput/types';

// import colors from '../../styles/colors';

import styles from './styles';

interface Props {
  onFocus?: () => void;
  value?: string;
  label?: string;
  placeholder?: string;
  editable?: boolean;
}

const renderTouchText = (props: RenderProps) => {
  const { style, value, onFocus } = props;

  return (
    <TouchableRipple onPress={onFocus}>
      <Text style={style}>{value}</Text>
    </TouchableRipple>
  );
};

const SelectableInput: React.FC<Props> = ({ value, onFocus, label, placeholder, editable }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={value}
          onFocus={onFocus}
          // render={renderTouchText}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
          mode="outlined"
          style={styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          right={<TextInput.Icon name="chevron-right" style={{ marginTop: 14 }} onPress={onFocus} />}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default SelectableInput;
