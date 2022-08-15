import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Platform } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { AppScreen, DrawerButton, globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';

import { GDMN_COMPANY_NAME, GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS, GDMN_TRADEMARK } from '../constants';

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

  return (
    <AppScreen>
      <View style={localStyles.container}>
        <Text style={[styles.title]}>Приложение {Constants.manifest?.extra?.name}</Text>
        <Divider />
        <View style={[localStyles.profileContainer]}>
          <View style={localStyles.profileIcon}>
            <Avatar.Icon size={40} icon="cog-outline" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.profileInfo}>
            <LargeText style={styles.textBold}>Версия</LargeText>
            <MediumText>
              {Constants.manifest?.extra?.appVesion}-{Constants.manifest?.extra?.buildVersion || 0}
            </MediumText>
          </View>
        </View>
        <Divider />
        <View style={[localStyles.profileContainer]}>
          <View style={localStyles.profileIcon}>
            <Avatar.Icon size={40} icon="file-document-edit-outline" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.profileInfo}>
            <TouchableOpacity onPress={() => Linking.openURL(Constants.manifest?.extra?.documentationUrl)}>
              <LargeText style={styles.textBold}>Документация</LargeText>
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
            <LargeText style={styles.textBold} selectable={true}>
              {GDMN_COMPANY_NAME}
            </LargeText>
            <MediumText selectable={true}>{GDMN_TRADEMARK}</MediumText>
          </View>
        </View>
        <Divider />
        <View style={[localStyles.profileContainer]}>
          <View style={localStyles.profileIcon}>
            <Avatar.Icon size={40} icon="phone" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.profileInfo}>
            <LargeText style={styles.textBold}>Телефон</LargeText>
            <TouchableOpacity onPress={() => dialCall(GDMN_PHONE)}>
              <MediumText selectable={true}>{GDMN_PHONE}</MediumText>
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
        <View style={[localStyles.profileContainer]}>
          <View style={localStyles.profileIcon}>
            <Avatar.Icon size={40} icon="email-outline" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.profileInfo}>
            <LargeText style={styles.textBold}>Email</LargeText>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${GDMN_EMAIL}`)}>
              <MediumText selectable={true}>{GDMN_EMAIL}</MediumText>
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
        <View style={[localStyles.profileContainer]}>
          <View style={localStyles.profileIcon}>
            <Avatar.Icon size={40} icon="web" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.profileInfo}>
            <LargeText style={styles.textBold}>Сайт</LargeText>
            <TouchableOpacity onPress={() => Linking.openURL(GDMN_SITE_ADDRESS)}>
              <MediumText selectable={true} style={{ textDecorationLine: 'underline' }}>
                {GDMN_SITE_ADDRESS}
              </MediumText>
            </TouchableOpacity>
          </View>
        </View>
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
});
