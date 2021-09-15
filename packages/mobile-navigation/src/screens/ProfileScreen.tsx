import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { authActions, useSelector, useDispatch } from '@lib/store';

import { DrawerButton } from '@lib/mobile-ui/src/components/AppBar';
import { PrimeButton } from '@lib/mobile-ui/src/components';

const ProfileScreen = () => {
  const { colors } = useTheme();

  const { user, company, device } = useSelector((state) => state.auth);
  console.log("user?.settings", user?.settings);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  const handleLogout = () => dispatch(authActions.logout());
  // const handleChangeCompany = () => dispatch(authActions.setCompany(undefined));

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer]}>
        <View style={styles.profileIcon}>
          <Avatar.Icon size={50} icon="badge-account-horizontal-outline" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{user?.firstName || ''}</Text>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{user?.lastName || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.placeholder }]}>{company?.name || ''}</Text>
        </View>
      </View>
      <Divider />
      <View style={[styles.profileContainer]}>
        <View style={styles.profileIcon}>
          <Avatar.Icon size={50} icon="devices" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{device?.name || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.state || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.uid || ''}</Text>
        </View>
      </View>
      <Divider />
      <View>
        <PrimeButton outlined onPress={handleLogout}>
          Сменить пользователя
        </PrimeButton>
        {/*         <PrimeButton outlined onPress={handleChangeCompany}>
          Сменить организацию
        </PrimeButton> */}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
  profileIcon: {
    justifyContent: 'space-around',
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileInfoTextCompany: {
    fontSize: 14,
    fontWeight: '300',
  },
  profileInfoTextUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
