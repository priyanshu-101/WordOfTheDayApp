import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const sampleWords = [
  { word: "Serendipity", definition: "The occurrence of events by chance in a happy way.", example: "Finding that rare book was pure serendipity." },
  { word: "Eloquent", definition: "Fluent or persuasive in speaking or writing.", example: "She gave an eloquent speech." },
  { word: "Ephemeral", definition: "Lasting for a very short time.", example: "Youth is ephemeral." },
  { word: "Ineffable", definition: "Too great to be expressed in words.", example: "The beauty of the sunset was ineffable." },
];

export default function HomeScreen({ navigation }) {
  const [wordData, setWordData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentWord();
  }, []);

  const loadCurrentWord = async () => {
    try {
      const storedWord = await AsyncStorage.getItem('currentWord');
      if (storedWord) {
        setWordData(JSON.parse(storedWord));
      } else {
        fetchNewWord(); 
      }
    } catch (error) {
      console.log('Error loading current word:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewWord = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem('history');
      const history = storedHistory ? JSON.parse(storedHistory) : [];

      const viewedWords = history.map(item => item.word);

      const availableWords = sampleWords.filter(word => !viewedWords.includes(word.word));

      if (availableWords.length === 0) {
        Alert.alert('No more new words!', 'You have seen all available words.');
        setIsLoading(false);
        return;
      }

      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      const today = new Date().toLocaleDateString();
      const newWord = { ...randomWord, date: today };

      setWordData(newWord);

      // Save to history
      await AsyncStorage.setItem('history', JSON.stringify([newWord, ...history]));

      // Save separately as current word
      await AsyncStorage.setItem('currentWord', JSON.stringify(newWord));
    } catch (error) {
      console.log('Error fetching new word:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = async () => {
    try {
      await AsyncStorage.clear();
      setWordData(null);
      Toast.show({
        type: 'success',
        text1: 'App Reset Successfully!',
      });
      fetchNewWord();
    } catch (error) {
      console.log('Error resetting app:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!wordData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word of the Day</Text>
      <Text style={styles.word}>{wordData.word}</Text>
      <Text style={styles.definition}>Definition: {wordData.definition}</Text>
      <Text style={styles.example}>Example: {wordData.example}</Text>

      <View style={styles.buttonContainer}>
        <Button title="New Word" onPress={fetchNewWord} />
        <View style={{ marginTop: 10 }} />
        <Button title="View History" onPress={() => navigation.navigate('History')} />
        <View style={{ marginTop: 10 }} />
        <Button title="Reset All" color="red" onPress={resetAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20, 
    justifyContent: 'center'
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center',
  },
  word: {
    fontSize: 22, 
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  definition: {
    fontSize: 16,
    marginBottom: 5,
  },
  example: {
    fontStyle: 'italic',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
