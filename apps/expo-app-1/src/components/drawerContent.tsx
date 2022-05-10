/* eslint-disable react-native/no-unused-styles */
import { StyleSheet } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  // useDrawerProgress,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

export function DrawerContent({ ...props }: DrawerContentComponentProps) {
  // const progress = useDrawerProgress() as Animated.Node<number>;

  // console.log(`progress ${progress}`);
  // const translateX = Animated.interpolateNode(progress, {
  //   inputRange: [0, 0.5, 0.7, 0.8, 1],
  //   outputRange: [-100, -85, -70, -45, 0],
  // });

  return (
    <>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Animated.View
          style={[
            styles.drawerContent,
            // {
            //   transform: [{ translateX }],
            // },
          ]}
        >
          <DrawerItemList {...props} />
        </Animated.View>
      </DrawerContentScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfile: {
    marginTop: 15,
    flexDirection: 'column',
  },
  profileInfo: {
    paddingLeft: 10,
    paddingTop: 0,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  text: {
    padding: 2,
  },
  caption: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 14,
  },
  updateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  systemInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  drawerSection: {
    marginTop: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
