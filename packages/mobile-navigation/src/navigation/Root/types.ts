type DocumentsStackParamList = {
  Documents: undefined;
  DocumentView: { id: string };
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
  DocumentsStackParamList,
  MessagesStackParamList,
  ProfileStackParamList,
  ReferenceStackParamList,
  SettingsStackParamList,
  TabsStackParams,
};
