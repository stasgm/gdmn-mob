import { DropdownInput, ItemSeparator, MediumText, globalStyles as styles } from '@lib/mobile-ui';
import React, { useState } from 'react';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';

import { refSelectors } from '@lib/store';
import { IDepartment, INamedEntity } from '@lib/types';

import { TouchableOpacity, View } from 'react-native';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (depart: INamedEntity) => void;
}

export const OrderDepartDialog = React.memo(({ onCancel, onOk, visible = false }: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  const labelStyle = { color: colors.primary };
  const departmentList = refSelectors.selectByName<IDepartment>('department')?.data;
  const [visibleList, setVisibleList] = useState(false);
  const [depart, setDepart] = useState<IDepartment | undefined>(undefined);

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={styles.text18}>Выберите склад:</Dialog.Title>
      <>
        <Dialog.Content>
          <DropdownInput
            label="Склад"
            onPress={() => setVisibleList(!visibleList)}
            isShownList={visibleList}
            value={depart?.name || ''}
          />
          {visibleList && (
            <View
              style={{
                marginTop: -13,
                display: 'flex',
                flexDirection: 'column',
                marginHorizontal: 10,
                /*fontSize: 17,*/
                // paddingRight: 18,
                // backgroundColor: colors.disabled,
                overflow: 'scroll',
                // maxHeight: 50,
                borderColor: colors.primary,
                borderRadius: 2,
                borderWidth: 1,
              }}
            >
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
                    style={{ paddingLeft: 10, paddingVertical: 3 }}
                  >
                    <MediumText>{item.name}</MediumText>
                  </TouchableOpacity>
                  <ItemSeparator />
                </View>
              ))}
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.columnAlignEnd}>
          <Button
            labelStyle={labelStyle}
            color={colors.primary}
            disabled={!depart}
            onPress={() => depart && onOk(depart)}
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
