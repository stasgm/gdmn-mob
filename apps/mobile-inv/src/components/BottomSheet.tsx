import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useMemo, Ref, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ItemSeparator from './ItemSeparator';

interface IProps {
  sheetRef: Ref<BottomSheetModal>;
  children?: ReactNode;
  title?: string;
  handelDismiss: () => void;
  handelApply: () => void;
}

const BottomSheet = ({ sheetRef, children, title, handelDismiss, handelApply }: IProps) => {
  const snapPoints = useMemo(() => ['40%', '90%'], []);
  return (
    <View>
      <BottomSheetModal ref={sheetRef} snapPoints={snapPoints} backdropComponent={BottomSheetBackdrop}>
        <View style={localStyles.container}>
          <View style={localStyles.headerContainer}>
            <TouchableOpacity onPress={handelDismiss}>
              <MaterialCommunityIcons name={'close'} color={'#000'} size={24} />
            </TouchableOpacity>
            <Text style={localStyles.text}>{title}</Text>
            <TouchableOpacity onPress={handelApply}>
              <MaterialCommunityIcons name={'check'} color={'#000'} size={24} />
            </TouchableOpacity>
          </View>
          <ItemSeparator />
        </View>
        <BottomSheetScrollView style={localStyles.content}>
          <View>{children}</View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  content: {
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: 4,
    marginRight: 14,
  },
  text: {
    fontSize: 20,
  },
});

export default BottomSheet;
