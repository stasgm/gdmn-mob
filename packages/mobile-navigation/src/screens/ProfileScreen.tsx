import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Divider, useTheme, Button } from 'react-native-paper';

import { authActions, useSelector, useDispatch } from '@lib/store';

const ProfileScreen = () => {
  const { colors } = useTheme();

  const { user, company, device } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(authActions.logout());
  const handleChangeCompany = () => dispatch(authActions.setCompany(undefined));

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer]}>
        <View style={styles.profileIcon}>
          <Avatar.Icon
            size={50}
            icon="badge-account-horizontal-outline"
            style={{ backgroundColor: colors.background }}
            color={colors.text}
          />
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
          <Avatar.Icon size={50} icon="devices" style={{ backgroundColor: colors.background }} color={colors.text} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileInfoTextUser, { color: colors.text }]}>{device?.name || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.state || ''}</Text>
          <Text style={[styles.profileInfoTextCompany, { color: colors.text }]}>{device?.uid || ''}</Text>
        </View>
      </View>
      <Divider />
      <View>
        <Button mode="outlined" style={[styles.button]} onPress={handleLogout}>
          Сменить пользователя
        </Button>
        <Button mode="outlined" style={[styles.button]} onPress={handleChangeCompany}>
          Сменить организацию
        </Button>
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
  button: {
    height: 50,
    justifyContent: 'center',
    margin: 10,
  },
});
