import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';

import { globalStyles as styles, ScreenTitle, RadioGroup, PrimeButton, RoundButton, AppScreen } from '@lib/mobile-ui';
import { ICompany, IResponse } from '@lib/types';
import { company3 } from '@lib/mock';

import localStyles from './styles';

type Props = {
  onLogout: () => void;
  onSetCompany: (company: ICompany) => void;
};

const CompaniesScreen = (props: Props) => {
  const { onLogout, onSetCompany } = props;

  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(undefined);
  const [companies, setCompanies] = useState<ICompany[]>([]);

  // TODO 1. Загрузка списка компаний
  useEffect(() => {
    const loadCompanies = async () => {
      // const response = await apiService.auth.getUserStatus();
      const response: IResponse<ICompany[]> = {
        result: true,
        // data: [company3, company2, company, { ...company2, id: '111', name: 'Новая компания с длинным названием' }],
        data: [company3],
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
      //   actions.logout();
      //   return;
      // }
      // throw new Error();
      // Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    } catch (error) {
      // Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    }
  };

  const handleSelectCompany = () => {
    selectedCompany && onSetCompany(selectedCompany);
  };

  return (
    <>
      <AppScreen>
        <ScreenTitle style={styles.subHeader}>Выбор организации</ScreenTitle>
        <ScrollView showsHorizontalScrollIndicator={true} style={localStyles.scroll}>
          <RadioGroup
            onChange={(value) => setSelectedCompany(companies.find((i) => i.id === value.id))}
            options={companies.map((i) => ({ id: i.id, value: i.name }))}
            activeButtonId={selectedCompany?.id}
          />
        </ScrollView>
        <PrimeButton icon="check-circle-outline" disabled={!selectedCompany} onPress={handleSelectCompany}>
          Выбрать
        </PrimeButton>
      </AppScreen>
      <View style={styles.buttons}>
        <RoundButton icon="account" onPress={handleLogOut} />
      </View>
    </>
  );
};

export default CompaniesScreen;
