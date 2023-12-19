import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export { DashboardStackParamList } from './Root/types';

export type RootDrawerParamList = {
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Information: undefined;
  [itemName: string]: undefined;
};

export type ScreenParams = {
  [paramName: string]: any;
};

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
  color?: string;
  sortNumber?: number;
  showInDashboard?: boolean;
  dashboardScreenName?: string;
  dashboardScreenParams?: ScreenParams;
}
