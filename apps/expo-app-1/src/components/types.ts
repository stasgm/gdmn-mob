import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export type RootDrawerParamList = {
  [itemName: string]: undefined;
};

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
}

export interface IDrawerProps {
  items?: INavItem[];
}
