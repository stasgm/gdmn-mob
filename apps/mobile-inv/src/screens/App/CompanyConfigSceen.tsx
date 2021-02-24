import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert, Text, TextInput } from 'react-native';
import { FAB } from 'react-native-paper';

import { IResponse } from '../../../../common';
import { IWeightCodeSettings } from '../../../../common/base';
import { IMessageInfo } from '../../../../common/models';
import ItemSeparator from '../../components/ItemSeparator';
import SubTitle from '../../components/SubTitle';
import { timeout } from '../../helpers/utils';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../store';

type Props = StackScreenProps<SettingsStackParamList, 'CompanyConfig'>;

const CompanyConfigScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const {
    state: { companySettings },
    actions: appActions,
  } = useAppStore();
  const { state } = useAuthStore();

  const weightSettings = (companySettings?.weightSettings as unknown) as IWeightCodeSettings;

  const sendUpdateRequest = useCallback(() => {
    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_config',
          params: [],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', '', [{ text: 'Закрыть' }]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [apiService.baseUrl.timeout, apiService.data, state.companyID]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={[localStyles.container, { backgroundColor: colors.card }]}>
          <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Весовой товар</SubTitle>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Идентификатор весового товара:</Text>
            <TextInput
              style={[localStyles.input, { borderColor: colors.border }]}
              keyboardType={'number-pad'}
              onChangeText={(value) =>
                appActions.setCompanySettings({
                  ...companySettings,
                  weightSettings: {
                    ...companySettings?.weightSettings,
                    weightCode: value.trim(),
                  },
                })
              }
              value={weightSettings?.weightCode || ''}
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Количество символов для кода товара :</Text>
            <TextInput
              style={[localStyles.input, { borderColor: colors.border }]}
              keyboardType={'number-pad'}
              onChangeText={(value) =>
                appActions.setCompanySettings({
                  ...companySettings,
                  weightSettings: {
                    ...companySettings?.weightSettings,
                    code: value,
                  },
                })
              }
              value={weightSettings?.code?.toString()}
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Количество символов для веса (в гр.):</Text>
            <TextInput
              style={[localStyles.input, { borderColor: colors.border }]}
              keyboardType={'number-pad'}
              onChangeText={(value) =>
                appActions.setCompanySettings({
                  ...companySettings,
                  weightSettings: {
                    ...companySettings?.weightSettings,
                    weight: value,
                  },
                })
              }
              value={weightSettings?.weight?.toString()}
            />
          </View>

          {/* <Text style={localStyles.subdivisionText}>Выберите организацию: </Text> */}
          {/* <TextInput>Test</TextInput> */}
        </View>
      </ScrollView>
      <FAB
        style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
        icon="sync"
        onPress={() => {
          sendUpdateRequest();
        }}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  content: {
    flex: 1,
    height: '100%',
  },
  fabSync: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    margin: 5,
  },
  input: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexGrow: 1,
    height: 40,
    padding: 10,
  },
  inputCaption: {
    width: 160,
  },
  title: {
    padding: 10,
  },
});

export { CompanyConfigScreen };
