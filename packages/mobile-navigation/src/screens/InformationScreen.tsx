import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Platform } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { DrawerButton, globalStyles as styles } from '@lib/mobile-ui';

import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';

import { GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS } from '../constants';

const dialCall = (number: string) => {
  let phoneNumber = '';
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${number}`;
  } else {
    phoneNumber = `telprompt:${number}`;
  }
  Linking.openURL(phoneNumber);
};

const InformationScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);
  console.log('Constants.manifest?.extra?.documentationUrl', Constants.manifest?.extra?.documentationUrl);

  return (
    <View style={localStyles.container}>
      <Text style={[styles.title]}>Приложение {Constants.manifest?.extra?.name}</Text>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="cog-outline" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Версия</Text>
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>
            {Constants.manifest?.extra?.appVesion}-{Constants.manifest?.extra?.buildVersion || 0}
          </Text>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="file-document-edit-outline" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <TouchableOpacity onPress={() => Linking.openURL(Constants.manifest?.extra?.documentationUrl)}>
            <Text style={localStyles.profileInfoTextUser}>Документация</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.title]}>О разработчике</Text>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="office-building" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text selectable={true} style={localStyles.profileInfoTextUser}>
            Компания ООО Амперсант
          </Text>
          <Text selectable={true} style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>
            Торговая марка Golden Software
          </Text>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="phone" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Телефон</Text>
          <TouchableOpacity onPress={() => dialCall(GDMN_PHONE)}>
            <Text selectable={true} style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>
              + 375 17 256 17 59
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="email-outline" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Email</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${GDMN_EMAIL}`)}>
            <Text selectable={true} style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>
              {GDMN_EMAIL}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="web" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Сайт</Text>
          <TouchableOpacity onPress={() => Linking.openURL(GDMN_SITE_ADDRESS)}>
            <Text
              selectable={true}
              style={[localStyles.profileInfoTextCompany, { color: colors.text, textDecorationLine: 'underline' }]}
            >
              {GDMN_SITE_ADDRESS}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    // alignItems: 'flex-start',
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
  profileInfoTextCompany: {
    fontSize: 15,
    fontWeight: '300',
  },
  profileInfoTextUser: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    fontSize: 17,
    // color: colors.text,
  },
});