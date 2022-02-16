import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export type RootDrawerParamList = {
  Dashboard: undefined;
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Messages: undefined;
  //[titleDoc?: string]: undefined;
  [itemName: string]: { title: string } | undefined;
};

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
  // titleDoc?: string;
}
