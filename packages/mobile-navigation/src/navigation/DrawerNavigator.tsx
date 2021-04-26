import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerActions } from "@react-navigation/native";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

import ProfileScreen from "../screens/ProfileScreen";

import { DrawerContent } from "./drawerContent";

//import ReferencesNavigator from "./Root/ReferencesNavigator";
import SettingsNavigator from "./Root/SettingsNavigator";

export type RootDrawerParamList = {
  Dashboard: undefined;
  Documents: undefined;
  References: undefined;
  Settings: undefined;
  Profile: undefined;
  Map: undefined;
  [itemName: string]: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const Header = ({ scene }: DrawerHeaderProps) => {
  const { options } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      <Appbar.Action
        icon="menu"
        onPress={() =>
          scene.descriptor.navigation.dispatch(DrawerActions.openDrawer())
        }
      />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

console.log("DrawerNavigator");

export interface INavItem {
  name: string;
  title: string;
  icon: keyof typeof Icon.glyphMap;
  component: any;
}

export interface IProps {
  items?: INavItem[];
}

const DrawerNavigator = (props: IProps) => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeBackgroundColor: colors.primary,
        activeTintColor: "#ffffff",
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
      }}
    >
      {props?.items?.map((item) => (
        <Drawer.Screen
          name={item.name}
          key={item.name}
          component={item.component}
          options={{
            title: item.title,
            drawerIcon: (pr) => <Icon name={item.icon} {...pr} />,
          }}
        />
      ))}
      {/*<Drawer.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          title: 'Справочники',
          drawerIcon: (props) => <Icon name="book-multiple-outline" {...props} />,
        }}
      />*/}
      <Drawer.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: "Настройки",
          drawerIcon: (props) => <Icon name="tune" {...props} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Профиль",
          drawerIcon: (props) => (
            <Icon name="account-circle-outline" {...props} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
