import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, RadioButton, Button, IconButton } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import { appStorage } from '../../helpers/utils';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [companies, setCompanies] = useState<string[]>([]);

  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const {
    state: { userID },
    actions,
  } = useAuthStore();

  useEffect(() => {
    const loadCompanies = async () => {
      const response = await apiService.auth.getUserStatus();
      if (response.result) {
        setCompanies(response.data?.companies || []);
      }
    };
    loadCompanies();
  }, [apiService.auth]);

  useEffect(() => {
    const getCompanyId = async () => {
      const savedCompany = await appStorage.getItem(`${userID}/companyId`);
      /*
        Автоматический вход:
          Когда получим список организаций пользователя, проверим,
          есть ли у пользователя организация, под которой он заходил в последний раз,
          входит ли этот пользователь ещё в эту организацию.

        TODO Если хотим сменить то происходит снова автоматический вход
      */
      if (!!savedCompany && companies.some((company) => company === savedCompany)) {
        setSelectedCompany(savedCompany);
        //   actions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });
      } else {
        setSelectedCompany(companies[0]);
      }
    };

    if (userID !== null && companies?.length > 0) {
      getCompanyId();
    }
  }, [userID, companies, actions]);

  const logOut = async () => {
    try {
      const res = await apiService.auth.logout();
      if (res.result) {
        actions.logOut();
        return;
      }
      Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    } catch (error) {
      Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Выбор организации</SubTitle>
        <ScrollView contentContainerStyle={localStyles.scrollContainer} style={localStyles.scroll}>
          <RadioButton.Group onValueChange={(newValue) => setSelectedCompany(newValue)} value={selectedCompany}>
            {companies?.length > 0 &&
              companies.map((el) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedCompany(el)}
                    key={el}
                    style={[
                      { backgroundColor: selectedCompany === el ? colors.primary : colors.background },
                      localStyles.item,
                    ]}
                  >
                    <View style={localStyles.row}>
                      <RadioButton value={el} color={colors.background} />
                      <Text style={{ color: selectedCompany === el ? colors.background : colors.text }}>{el}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </RadioButton.Group>
        </ScrollView>
        <View style={localStyles.buttonView}>
          <Button
            mode="contained"
            icon="login"
            style={[styles.rectangularButton, localStyles.button]}
            disabled={!companies?.length || !selectedCompany}
            onPress={async () => {
              actions.setCompanyID({ companyId: selectedCompany, companyName: selectedCompany });
              await appStorage.setItem(`${userID}/companyId`, selectedCompany);
            }}
          >
            Войти
          </Button>
        </View>
      </View>
      <View style={styles.bottomButtons}>
        <IconButton
          icon="account"
          size={30}
          onPress={logOut}
          style={{
            ...styles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

export { CompaniesScreen };

const localStyles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonView: {
    flexDirection: 'row',
  },
  item: {
    borderRadius: 4,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  scroll: {
    marginVertical: 10,
    maxHeight: 150,
  },
  scrollContainer: {
    justifyContent: 'flex-end',
  },
  title: {
    padding: 10,
  },
});
