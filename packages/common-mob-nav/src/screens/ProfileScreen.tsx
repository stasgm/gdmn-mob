import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Divider, useTheme, Button } from 'react-native-paper';

import { authActions, RootState } from '@lib/common-store';
import { useDispatch, useSelector } from 'react-redux';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = () => dispatch(authActions.logout());

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
          <Text style={[styles.profileInfoTextCompany, { color: colors.placeholder }]}>
            {user?.companies?.[0] || ''}
          </Text>
        </View>
      </View>
      <Divider />
      <View>
        <Button mode="outlined" style={[styles.button]} onPress={handleLogout}>
          Сменить пользователя
        </Button>
        <Button
          mode="outlined"
          style={[styles.button]}
          onPress={() => {
            console.log('change company');
          }}
        >
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
