import { DropdownInput, ItemSeparator, MediumText, globalStyles as styles } from '@lib/mobile-ui';
import React, { useState } from 'react';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';

import { refSelectors } from '@lib/store';
import { IDepartment, INamedEntity } from '@lib/types';

import { TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (depart: INamedEntity, expeditor?: INamedEntity) => void;
}

export const OrderDepartDialog = React.memo(({ onCancel, onOk, visible = false }: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  const labelStyle = { color: colors.primary };
  const departmentList = refSelectors.selectByName<IDepartment>('department')?.data;

  const [visibleList, setVisibleList] = useState(false);
  const [depart, setDepart] = useState<IDepartment | undefined>(undefined);

  const expeditorList = refSelectors.selectByName<IDepartment>('expeditors')?.data || [];

  const [visibleEmployeeList, setVisibleEmployeeList] = useState(false);
  const [expeditor, setExpeditor] = useState<INamedEntity | undefined>(undefined);

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={styles.text18}>{expeditorList?.length ? 'Укажите данные:' : 'Выберите склад:'}</Dialog.Title>
      <>
        <Dialog.Content>
          <DropdownInput
            label="Склад"
            onPress={() => setVisibleList(!visibleList)}
            isShownList={visibleList}
            value={depart?.name || ''}
          />
          {visibleList && (
            <View style={[localStyles.view, { borderColor: colors.primary }]}>
              {departmentList.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: item.id === depart?.id ? colors.accent : '',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setDepart(item);
                      setVisibleList(false);
                    }}
                    style={localStyles.dropdown}
                  >
                    <MediumText>{item.name}</MediumText>
                  </TouchableOpacity>
                  <ItemSeparator />
                </View>
              ))}
            </View>
          )}
          {expeditorList?.length ? (
            <>
              <DropdownInput
                label="Экспедитор"
                onPress={() => setVisibleEmployeeList(!visibleEmployeeList)}
                isShownList={visibleEmployeeList}
                value={expeditor?.name || ''}
              />
              {visibleEmployeeList && (
                <ScrollView style={[localStyles.view, localStyles.employeeView, { borderColor: colors.primary }]}>
                  {expeditorList.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        backgroundColor: item.id === expeditor?.id ? colors.accent : '',
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setExpeditor(item);
                          setVisibleEmployeeList(false);
                        }}
                        style={localStyles.dropdown}
                      >
                        <MediumText>{item.name}</MediumText>
                      </TouchableOpacity>
                      <ItemSeparator />
                    </View>
                  ))}
                </ScrollView>
              )}
            </>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions style={styles.columnAlignEnd}>
          <Button
            labelStyle={labelStyle}
            color={colors.primary}
            disabled={!depart}
            onPress={() => (expeditor ? depart && onOk(depart, expeditor) : depart && onOk(depart))}
          >
            ОК
          </Button>
          <Button color={colors.primary} onPress={onCancel}>
            Отмена
          </Button>
        </Dialog.Actions>
      </>
    </Dialog>
  );
});

const localStyles = StyleSheet.create({
  employeeView: {
    maxHeight: 150,
  },
  view: {
    marginTop: -13,
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 10,
    overflow: 'scroll',
    borderRadius: 2,
    borderWidth: 1,
    maxHeight: 150,
  },
  dropdown: { paddingLeft: 10, paddingVertical: 3 },
});
