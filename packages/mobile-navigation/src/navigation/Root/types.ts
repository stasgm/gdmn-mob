import { ViewStyle } from 'react-native';

type DocumentsStackParamList = {
  TabsNavigator: undefined;
};

type DocumentsTabsStackParamsList = {
  DocumentList: { type: string } | undefined;
  DocumentView: {
    id: string;
    view?: { componentItem?: ({ item }: { item: any }) => JSX.Element; titles?: string[]; styleHeader?: ViewStyle };
  };
};

type MessagesStackParamList = {
  MessageList: undefined;
  MessageView: { id: string };
};

type ProfileStackParamList = {
  Profile: undefined;
};

type InformationStackParamList = {
  Information: undefined;
  Log: undefined;
};

type ReferenceStackParamList = {
  ReferenceList: undefined;
  ReferenceView: { name: string };
  ReferenceDetals: { name: string; id: string };
};

type SettingsStackParamList = {
  Settings: undefined;
  SettingsDetails: { id: string };
};

type TabsStackParams = {
  [itemName: string]: { type: string };
};

export {
  DocumentsTabsStackParamsList,
  DocumentsStackParamList,
  MessagesStackParamList,
  ProfileStackParamList,
  InformationStackParamList,
  ReferenceStackParamList,
  SettingsStackParamList,
  TabsStackParams,
};
