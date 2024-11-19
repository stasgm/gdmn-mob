import { GDMN_COMPANY_NAME, GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS, GDMN_TRADEMARK } from '../constants';
import { InformationStackParamList } from '../navigation/Root/types';
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  StyleProp,
  TextStyle,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Avatar, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Constants from 'expo-constants';

import {
  AppScreen,
  globalColors as customColors,
  globalStyles as styles,
  LargeText,
  MediumText,
  navBackDrawer,
} from '@lib/mobile-ui';
import { StackNavigationProp } from '@react-navigation/stack';

const dialCall = (number: string) => {
  let phoneNumber = '';
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${number}`;
  } else {
    phoneNumber = `telprompt:${number}`;
  }
  Linking.openURL(phoneNumber);
};

interface IProfileItem {
  id: string;
  icon: any;
  title: string;
  text: string;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
}

const ProfileItem = ({ item, iconStyle }: { item: IProfileItem; iconStyle: StyleProp<ViewStyle> }) => {
  const { dark } = useTheme();
  return (
    <>
      <Divider theme={{ dark }} />
      <View style={localStyles.profileContainer}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon={item.icon} style={iconStyle} />
        </View>
        <View style={localStyles.profileInfo}>
          <LargeText style={styles.textBold}>{item.title}</LargeText>
          <TouchableOpacity onPress={item.onPress}>
            <MediumText selectable={true} style={item.style}>
              {item.text}
            </MediumText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const InformationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<InformationStackParamList, 'Information'>>();
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
    });
  }, [navigation]);

  const appList: IProfileItem[] = [
    {
      id: 'version',
      icon: 'cog-outline',
      title: 'Версия',
      text: `${Constants.expoConfig?.extra?.appVesion}-${Constants.expoConfig?.extra?.buildVersion || 0}`,
    },
    {
      id: 'doc',
      icon: 'file-document-edit-outline',
      title: 'Документация',
      text: Constants.expoConfig?.extra?.name,
      onPress: () => Linking.openURL(Constants.expoConfig?.extra?.documentationUrl),
      style: { textDecorationLine: 'underline' },
    },
    {
      id: 'log',
      icon: 'history',
      title: 'Дополнительная информация',
      text: 'Журнал ошибок',
      onPress: () => navigation.navigate('Log'),
      style: { textDecorationLine: 'underline' },
    },
  ];

  const developList: IProfileItem[] = [
    { id: 'companyName', icon: 'office-building', title: GDMN_COMPANY_NAME, text: GDMN_TRADEMARK },
    {
      id: 'phone',
      icon: 'phone',
      title: 'Телефон',
      text: GDMN_PHONE,
      onPress: () => dialCall(GDMN_PHONE),
    },
    {
      id: 'email',
      icon: 'email-outline',
      title: 'Email',
      text: GDMN_EMAIL,
      onPress: () => Linking.openURL(`mailto:${GDMN_EMAIL}`),
    },
    {
      id: 'web',
      icon: 'web',
      title: 'Сайт',
      text: GDMN_SITE_ADDRESS,
      onPress: () => Linking.openURL(GDMN_SITE_ADDRESS),
      style: { textDecorationLine: 'underline' },
    },
  ];

  const iconStyle = { backgroundColor: customColors.primary };

  return (
    <AppScreen>
      <ScrollView>
        <View style={localStyles.container}>
          <Text style={[{ color: colors.primary }, styles.title]}>Приложение {Constants.expoConfig?.extra?.name}</Text>
          {appList.map((item) => (
            <ProfileItem key={item.id} item={item} iconStyle={iconStyle} />
          ))}
          <Text style={[{ color: colors.primary }, styles.title]}>О разработчике</Text>
          {developList.map((item) => (
            <ProfileItem key={item.id} item={item} iconStyle={iconStyle} />
          ))}
        </View>
      </ScrollView>
      <MediumText style={localStyles.copyright}>
        Copyright © {new Date().getFullYear().toString()} OOO Ampersant
      </MediumText>
    </AppScreen>
  );
};

export default InformationScreen;

const localStyles = StyleSheet.create({
  container: {
    margin: 10,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  profileIcon: {
    justifyContent: 'space-around',
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 4,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
  },
});
