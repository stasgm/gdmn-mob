import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Avatar, Button, Text, IconButton } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { IResponse, IMessage, IReference, IDocument, IGood, IRefData } from '../../../../common';
import { IDataMessage } from '../../../../common/models';
import SettingsItem from '../../components/SettingsItem';
import { useActionSheet } from '../../helpers/useActionSheet';
import { timeout, isMessagesArray, appStorage } from '../../helpers/utils';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useAuthStore, useAppStore, useServiceStore } from '../../store';

type Props = StackScreenProps<SettingsStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state: AuthState } = useAuthStore();
  const {
    actions: appActions,
    state: { settings, documents, references, forms, companySettings, models },
  } = useAppStore();
  const {
    state: { companyID, userID },
    actions: authActions,
  } = useAuthStore();

  const [isLoading, setLoading] = useState(false);

  const showActionSheet = useActionSheet();

  // const setRemainsModel = useCallback(
  //   () =>
  //     (async () => {
  //       console.log(references?.contacts?.data);
  //       const remainsModel = getRemainsModel(
  //         references?.contacts?.data as IContact[],
  //         references?.goods?.data as IGood[],
  //         (references?.remains?.data as unknown) as IRemains[],
  //       );
  //       console.log(remainsModel);
  //       appActions.setModel(remainsModel);
  //     })(),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [references?.contacts?.data, references?.goods?.data, references?.remins?.data],
  // );

  const logOut = useCallback(
    () =>
      (async () => {
        const res = await apiService.auth.logout();
        if (res.result) {
          authActions.logOut();
        }
      })(),
    [apiService.auth, authActions],
  );

  const deleteAllData = useCallback(
    () =>
      (async () => {
        Alert.alert('Внимание!', 'Удалить все данные?', [
          {
            text: 'Да',
            onPress: () => {
              appActions.setDocuments([]);
              appActions.setReferences({});
              appActions.setModels({});
              appActions.setViewParams({});
              // navigation.dispatch(StackActions.popToTop());
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      })(),
    [appActions],
  );

  const sendGetReferencesRequest = useCallback(() => {
    if (documents?.some((document) => document.head?.status <= 1)) {
      Alert.alert('Внимание!', 'Нельзя обновить справочники, если есть документы со статусами "Черновик" и "Готово".', [
        {
          text: 'OK',
        },
      ]);
      return;
    }

    const getMessages = async () => {
      try {
        setLoading(true);
        // const response = await apiService.data.subscribe(companyID);
        const response = await timeout<IResponse<IMessage[]>>(10000, apiService.data.getMessages(companyID));

        if (!response.result) {
          Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть', onPress: () => ({}) }]);
          return;
        }

        if (!isMessagesArray(response.data)) {
          Alert.alert('Получены неверные данные.', 'Попробуйте ещё раз.', [{ text: 'Закрыть' }]);
          return;
        }

        let isUpdated = false;

        response.data?.forEach((message) => {
          if (message.body.type === 'data') {
            // Сообщение содержит данные
            ((message.body.payload as unknown) as IDataMessage[])?.forEach((dataSet) => {
              switch (dataSet.type) {
                case 'get_SellDocuments': {
                  const addDocuments = dataSet.data as IDocument[];
                  appActions.setDocuments([...documents, ...addDocuments]);
                  break;
                }
                case 'documenttypes':
                case 'contacts':
                case 'goodgroups':
                case 'remains':
                case 'goods': {
                  // const a = assertTypeof<'IGood'>('IGood', dataSet.data);
                  // TODO: преобразовывать json данные в модель данных
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const refObj = (dataSet as unknown) as IReference<any[]>;
                  appActions.setReference(refObj);
                  break;
                }
                default:
                  break;
              }
            });
            apiService.data.deleteMessage(companyID, message.head.id);
          }
          if (message.body.type === 'cmd') {
            // Сообщение содержит команду
            apiService.data.deleteMessage(companyID, message.head.id);
          }
          isUpdated = true;
        });

        /* Обработка сообщений, которые связаны с документами */
        const messagesForDocuments = response.data?.filter(
          (message) => message.body.type === 'response' && message.body.payload?.name === 'post_documents',
        );

        if (messagesForDocuments.length > 0) {
          messagesForDocuments?.forEach((message) => {
            if (Array.isArray(message.body.payload?.params) && message.body.payload.params.length > 0) {
              message.body.payload?.params?.forEach((paramDoc) => {
                if (paramDoc.result) {
                  const document = documents?.find((doc) => doc.id === paramDoc.docId);
                  if (document?.head?.status === 2) {
                    appActions.updateDocumentStatus({ id: paramDoc.docId, status: 3 });
                  }
                }
              });
            }
            apiService.data.deleteMessage(companyID, message.head.id);
          });
          isUpdated = true;
          // Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть' }]);
        }
        Alert.alert('Запрос обработан', isUpdated ? 'Справочники обновлены' : 'Обновлений нет', [{ text: 'Закрыть' }]);
      } catch (err) {
        Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [apiService.data, appActions, companyID, documents]);

  return (
    <>
      <View style={[localStyles.profileContainer, { backgroundColor: colors.primary }]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={50} icon="badge-account-horizontal-outline" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={[localStyles.profileInfoTextUser, { color: colors.background }]}>
            {AuthState.profile?.userName || ''}
          </Text>
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.card }]}>
            {AuthState.profile?.companyName || ''}
          </Text>
        </View>
        <IconButton
          icon="dots-vertical"
          color={colors.card}
          size={30}
          onPress={() =>
            showActionSheet([
              {
                title: 'Сменить пользователя',
                onPress: logOut,
              },
              {
                title: 'Сменить организацию',
                onPress: async () => {
                  await appStorage.removeItem(`${userID}/companyId`);
                  authActions.setCompanyID({ companyId: null, companyName: undefined });
                },
              },
              {
                title: 'Удалить все данные',
                type: 'destructive',
                onPress: deleteAllData,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ])
          }
        />
      </View>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View>
          <Button
            mode="text"
            style={localStyles.button}
            onPress={() => {
              navigation.navigate('CompanyConfig');
            }}
          >
            Настройки организации
          </Button>
          <Divider />
          {__DEV__ && (
            <>
              <Button
                mode="text"
                style={localStyles.button}
                onPress={async () => {
                  const log = await appStorage.getItem(`${AuthState.userID}/${AuthState.companyID}/REFERENCES`);
                  Reactotron.display({
                    name: 'Mobile Storage',
                    preview: log,
                    value: log,
                    important: true,
                  });
                }}
              >
                Проверить хранилище
              </Button>
              <Divider />
              <Button
                mode="text"
                style={localStyles.button}
                onPress={async () => {
                  Reactotron.display({
                    name: 'settings',
                    preview: 'settings',
                    value: settings,
                    important: true,
                  });
                  Reactotron.display({
                    name: 'companySettings',
                    preview: 'companySettings',
                    value: companySettings,
                    important: true,
                  });
                  Reactotron.display({
                    name: 'documents',
                    preview: 'documents',
                    value: documents,
                    important: true,
                  });
                  Reactotron.display({
                    name: 'references',
                    preview: 'references',
                    value: references,
                    important: true,
                  });
                  Reactotron.display({
                    name: 'forms',
                    preview: 'forms',
                    value: forms,
                    important: true,
                  });
                  Reactotron.display({
                    name: 'models',
                    preview: 'models',
                    value: models,
                    important: true,
                  });
                }}
              >
                Проверить стейт
              </Button>
              <Divider />
            </>
          )}
        </View>
        {/* <SettingsItem
          label="Синхронизировать"
          value={settings?.synchronization}
          onValueChange={() => appActions.setSettings({ ...settings, synchronization: !settings?.synchronization })}
        />
        <Divider />
        */}
        <Divider />
        <SettingsItem
          label="Использовать сканер штрихкодов"
          value={settings?.barcodeReader}
          onValueChange={() => appActions.setSettings({ ...settings, barcodeReader: !settings?.barcodeReader })}
        />
        <Divider />
        <SettingsItem
          label="Удалять документы после обработки учётной системой"
          value={settings?.autodeletingDocument}
          onValueChange={() =>
            appActions.setSettings({ ...settings, autodeletingDocument: !settings?.autodeletingDocument })
          }
        />
        <Divider />
      </ScrollView>
      <Button
        mode="contained"
        icon="update"
        style={[localStyles.refreshButton, { backgroundColor: colors.primary }]}
        disabled={isLoading}
        loading={isLoading}
        onPress={() => {
          sendGetReferencesRequest();
          //await setRemainsModel();
        }}
      >
        Проверить обновления
      </Button>
    </>
  );
};

const localStyles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
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
  refreshButton: {
    height: 50,
    justifyContent: 'center',
    margin: 10,
  },
});

export { SettingsScreen };
