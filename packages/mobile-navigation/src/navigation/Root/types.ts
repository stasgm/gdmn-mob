type ProfileStackParamList = {
  Profile: undefined;
  ProfileDetails: { id: string };
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
  ProfileStackParamList,
  InformationStackParamList,
  ReferenceStackParamList,
  SettingsStackParamList,
  TabsStackParams,
};
