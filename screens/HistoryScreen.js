import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setHistory([]);
      Toast.show({
        type: 'success',
        text1: 'History Cleared!',
      });
    } catch (error) {
      console.log('Error clearing history:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.word}>{item.word}</Text>
      <Text style={styles.definition}>Definition: {item.definition}</Text>
      <Text style={styles.example}>Example: {item.example}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text>No history found.</Text>}
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Clear History" color="red" onPress={clearHistory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  word: { fontSize: 20, fontWeight: 'bold' },
  definition: { fontSize: 16 },
  example: { fontSize: 14, fontStyle: 'italic' },
  date: { fontSize: 12, color: 'gray', marginTop: 5 },
});
