import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, RadioButton, Button, IconButton, useTheme } from 'react-native-paper';

import { globalStyles } from '@lib/mobile-ui';
import { SubTitle } from '@lib/mobile-ui/src/components';
import { ICompany, IResponse } from '@lib/types';
import { company, company2 } from '@lib/store/mock';

type Props = {
  onLogout: () => void;
  onSetCompany: (company: ICompany) => void;
};

const CompaniesScreen = (props: Props) => {
  const { onLogout, onSetCompany } = props;

  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(undefined);
  const [companies, setCompanies] = useState<ICompany[]>([]);

  const { colors } = useTheme();
  // const { apiService } = useServiceStore();

  // const {
  //   state: { userID },
  //   actions,
  // } = useAuthStore();

  // TODO 1. Загрузка списка компаний
  useEffect(() => {
    const loadCompanies = async () => {
      // const response = await apiService.auth.getUserStatus();
      const response: IResponse<ICompany[]> = {
        result: true,
        data: [company, company2],
      };

      if (response.result) {
        setCompanies(response.data || []);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    companies?.length && setSelectedCompany(companies[0]);
  }, [companies]);

  // TODO 2. Выбор компании (автоматический)
  useEffect(() => {
    /*  const getCompanyId = async () => {
       const savedCompany = await appStorage.getItem(`${userID}/companyId`);
         // Автоматический вход:
         //   Когда получим список организаций пользователя, проверим,
         //   есть ли у пользователя организация, под которой он заходил в последний раз,
         //   входит ли этот пользователь ещё в эту организацию.

         // TODO Если хотим сменить то происходит снова автоматический вход

       if (!!savedCompany && companies.some((company) => company === savedCompany)) {
         setSelectedCompany(savedCompany);
         //   actions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });
       } else {
         setSelectedCompany(companies[0]);
       }
      }
       }
     };
     if (userID !== null && companies?.length > 0) {
       getCompanyId();
      getCompanyId();
       getCompanyId();
     }
     */
  }, []);

  const handleLogOut = async () => {
    try {
      onLogout();
      // const res = await apiService.auth.logout();
      // if (res.result) {
      //   actions.logOut();
      //   return;
      // }
      // throw new Error();
      // Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    } catch (error) {
      // Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    }
  };

  return (
    <>
      <View style={globalStyles.container}>
        <SubTitle>Выбор организации</SubTitle>
        <ScrollView contentContainerStyle={localStyles.scrollContainer} style={localStyles.scroll}>
          <RadioButton.Group
            onValueChange={(value) => setSelectedCompany(companies.find((i) => i.id === value))}
            value={selectedCompany?.id || ''}
          >
            {companies?.length > 0 &&
              companies.map((el) => (
                <TouchableOpacity
                  onPress={() => setSelectedCompany(el)}
                  key={el.id}
                  style={[
                    {
                      backgroundColor: selectedCompany === el ? colors.primary : colors.background,
                    },
                    localStyles.item,
                  ]}
                >
                  <View style={localStyles.row}>
                    <RadioButton value={el.id} color={colors.background} />
                    <Text
                      style={{
                        color: selectedCompany === el ? colors.background : colors.text,
                      }}
                    >
                      {el.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </RadioButton.Group>
        </ScrollView>
        <View style={localStyles.buttonView}>
          <Button
            mode="contained"
            icon="check-circle-outline"
            style={[globalStyles.rectangularButton, localStyles.button]}
            disabled={!selectedCompany}
            onPress={async () => {
              selectedCompany && onSetCompany(selectedCompany);
              // actions.setCompanyID({ companyId: selectedCompany, companyName: selectedCompany });
              // await appStorage.setItem(`${userID}/companyId`, selectedCompany);
            }}
          >
            Выбрать
          </Button>
        </View>
      </View>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="account"
          size={30}
          onPress={handleLogOut}
          style={{
            ...globalStyles.circularButton,
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
});
