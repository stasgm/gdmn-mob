import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Platform, StyleProp, TextStyle } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';

import { AppScreen, globalStyles as styles, LargeText, MediumText, navBackDrawer } from '@lib/mobile-ui';

import Constants from 'expo-constants';

import { StackNavigationProp } from '@react-navigation/stack';

import { GDMN_COMPANY_NAME, GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS, GDMN_TRADEMARK } from '../constants';
import { InformationStackParamList } from '../navigation/Root/types';

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

const InformationScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<InformationStackParamList, 'Information'>>();

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
      text: `${Constants.manifest?.extra?.appVesion}-${Constants.manifest?.extra?.buildVersion || 0}`,
    },
    {
      id: 'doc',
      icon: 'file-document-edit-outline',
      title: 'Документация',
      text: Constants.manifest?.extra?.name,
      onPress: () => Linking.openURL(Constants.manifest?.extra?.documentationUrl),
      style: { textDecorationLine: 'underline' },
    },
    {
      id: 'log',
      icon: 'history',
      title: 'Дополнительная информация',
      text: 'История ошибок',
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

  const iconStyle = { backgroundColor: colors.primary };

  const ProfileItem = ({ item }: { item: IProfileItem }) => (
    <>
      <Divider />
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

  return (
    <AppScreen>
      <View style={localStyles.container}>
        <Text style={styles.title}>Приложение {Constants.manifest?.extra?.name}</Text>
        {appList.map((item) => (
          <ProfileItem key={item.id} item={item} />
        ))}
        <Text style={styles.title}>О разработчике</Text>
        {developList.map((item) => (
          <ProfileItem key={item.id} item={item} />
        ))}
      </View>
    </AppScreen>
  );
};

export default InformationScreen;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginVertical: 10,
  },
  descriptionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
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
  title: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  dialogTitle: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
  },
  dialog: {
    height: 380,
  },
  content: {
    height: 240,
  },
});
