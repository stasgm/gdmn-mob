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

type ReferenceStackParamList = {
  References: undefined;
};

type SettingsStackParamList = {
  Settings: undefined;
};

type TabsStackParams = {
  //OtherTypes: undefined;
  [itemName: string]: { type: string };
};

export {
  DocumentsTabsStackParamsList,
  DocumentsStackParamList,
  MessagesStackParamList,
  ProfileStackParamList,
  ReferenceStackParamList,
  SettingsStackParamList,
  TabsStackParams,
};
