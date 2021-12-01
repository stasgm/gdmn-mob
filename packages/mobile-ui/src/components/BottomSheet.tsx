import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, LogBox } from 'react-native';

import { ItemSeparator } from './ItemSeparator';

interface IProps {
  sheetRef?: React.RefObject<BottomSheetModalMethods>;
  children?: ReactNode;
  title?: string;
  snapPoints?: string[];
  onDismiss: () => void;
  onApply: () => void;
}

LogBox.ignoreAllLogs();

const BottomSheet = ({ sheetRef, children, title, snapPoints = ['40%', '90%'], onDismiss, onApply }: IProps) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={sheetRef} snapPoints={snapPoints} backdropComponent={BottomSheetBackdrop}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onDismiss}>
              <MaterialCommunityIcons name={'close'} color={'#000'} size={24} />
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
            <TouchableOpacity onPress={onApply}>
              <MaterialCommunityIcons name={'check'} color={'#000'} size={24} />
            </TouchableOpacity>
          </View>
          <ItemSeparator />
        </View>
        <BottomSheetScrollView style={styles.content}>
          <View>{children}</View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
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

export { BottomSheet };
