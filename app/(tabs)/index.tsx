import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import HistoryScreen from '../../screens/HistoryScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
      <Toast />
    </>
  );
}
