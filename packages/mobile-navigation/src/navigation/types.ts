import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export type RootDrawerParamList = {
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Information: undefined;
  [itemName: string]: undefined;
};

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
}
