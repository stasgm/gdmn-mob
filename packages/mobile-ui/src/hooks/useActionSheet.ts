import { useCallback } from 'react';
import { useActionSheet as useExpoActionSheet } from '@expo/react-native-action-sheet';

import { MD2Theme, useTheme } from 'react-native-paper';

type ActionSheetItem = {
  type?: 'normal' | 'destructive' | 'cancel';
  title: string;
  onPress?: () => void;
};

interface ActionSheetOptions {
  title?: string;
  message?: string;
  tintColor?: string;
  anchor?: number;
  defaultCancel?: boolean;
}

const useActionSheet = () => {
  const { showActionSheetWithOptions } = useExpoActionSheet();
  const { colors } = useTheme<MD2Theme>();

  return useCallback(
    (items: ActionSheetItem[], options: Partial<ActionSheetOptions> = {}) => {
      showActionSheetWithOptions(
        {
          ...options,
          options: items.map((i) => i.title).concat(options.defaultCancel ? ['Cancel'] : []),
          cancelButtonIndex: options.defaultCancel ? items.length : items.findIndex((i) => i.type === 'cancel'),
          destructiveButtonIndex: items.findIndex((i) => i.type === 'destructive'),
          tintColor: colors.text,
          containerStyle: { backgroundColor: colors.background },
        },
        (i) => {
          items[i as number]?.onPress?.();
        },
      );
    },
    [colors.background, colors.text, showActionSheetWithOptions],
  );
};

export default useActionSheet;
