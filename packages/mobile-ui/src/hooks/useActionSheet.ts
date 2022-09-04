import { useActionSheet as useExpoActionSheet } from '@expo/react-native-action-sheet';

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

  return (items: ActionSheetItem[], options: Partial<ActionSheetOptions> = {}) => {
    showActionSheetWithOptions(
      {
        ...options,
        options: items.map((i) => i.title).concat(options.defaultCancel ? ['Cancel'] : []),
        cancelButtonIndex: options.defaultCancel ? items.length : items.findIndex((i) => i.type === 'cancel'),
        destructiveButtonIndex: items.findIndex((i) => i.type === 'destructive'),
      },
      (i) => {
        items[i as number]?.onPress?.();
      },
    );
  };
};

export default useActionSheet;
