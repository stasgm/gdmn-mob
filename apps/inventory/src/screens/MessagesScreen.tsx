import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme, Button } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ItemSeparator } from "@lib/mobile-ui/src/components";

import { IDBMessage } from "@lib/types";

import { useSelector } from "../store";
import mesActions from "../store/mess";

// import { IAppState } from '../store';

const MessageItem = ({ item }: { item: IDBMessage }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate('DocumentView', { docId: item?.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons
            name="message-text-outline"
            size={20}
            color={"#FFF"}
          />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text
              style={[styles.name, { color: colors.text }]}
            >{`${item.head.producer.name} > ${item.head.consumer.name}`}</Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>
            Сообщение от {item.head.dateTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessagesScreen = () => {
  const { data, loading } = useSelector((state) => state.messanges);

  const dispatch = useDispatch();

  const handleSend = () => {
    //dispatch(mesActions.fetchMes);
  };

  const handleLoad = () => {
    dispatch(mesActions.fetchMes());
  };

  const handleReset = () => {
    dispatch(mesActions.mesActions.init());
  };

  const renderItem = ({ item }: { item: IDBMessage }) => (
    <MessageItem item={item} />
  );

  const ref = useRef<FlatList<IDBMessage>>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сообщения приложения</Text>
      <Button compact={false} onPress={handleSend}>
        Отправить
      </Button>
      <Button compact={false} onPress={handleLoad}>
        Получить
      </Button>
      <Button compact={false} onPress={handleReset}>
        Сбросить
      </Button>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        // refreshing={loading}
        refreshControl={
          <RefreshControl refreshing={loading} title="загрузка данных..." />
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyList}>Список пуст</Text> : null
        }
      />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    // alignItems: 'center',
  },
  icon: {
    alignItems: "center",
    backgroundColor: "#e91e63",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  number: {
    fontSize: 12,
  },
  directionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emptyList: {
    marginTop: 20,
    textAlign: "center",
  },
  field: {
    opacity: 0.5,
  },
});
