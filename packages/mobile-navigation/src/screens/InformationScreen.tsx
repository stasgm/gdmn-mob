import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { authActions, useSelector, useDispatch, documentActions, referenceActions, appActions } from '@lib/store';

import { DrawerButton, MenuButton } from '@lib/mobile-ui/src/components/AppBar';
import { PrimeButton, DescriptionItem } from '@lib/mobile-ui/src/components';
import api from '@lib/client-api';

import { useActionSheet, globalStyles as styles } from '@lib/mobile-ui';
import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';

const InformationScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  console.log('doc', Constants.manifest?.extra?.documentation);

  return (
    <View style={localStyles.container}>
      <Text style={[styles.title]}>Приложение {Constants.manifest?.extra?.name}</Text>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="sync" style={{ backgroundColor: colors.primary }} />
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
          <TouchableOpacity onPress={() => Linking.openURL('http://')}>
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
          <Text style={localStyles.profileInfoTextUser}>Компания ООО Амперсант</Text>
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>
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
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>+ 375 17 256 17 59</Text>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="email-outline" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Email</Text>
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>support@gsbelarus.com</Text>
        </View>
      </View>

      <Divider />

      <View style={[localStyles.profileContainer]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={40} icon="web" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={localStyles.profileInfoTextUser}>Сайт</Text>
          <TouchableOpacity onPress={() => Linking.openURL('http://gsbelarus.com')}>
            <Text style={[localStyles.profileInfoTextCompany, { color: colors.text }]}>http://gsbelarus.com</Text>
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
