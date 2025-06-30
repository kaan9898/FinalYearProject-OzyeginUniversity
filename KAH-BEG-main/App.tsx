import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GameSelectionScreen from './app/screens/GameSelectionScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import Game1Screen from './app/screens/Game1Screen';
import Game2Screen from './app/screens/Game2Screen';
import Game3Screen from './app/screens/Game3Screen';
import Game4Screen from './app/screens/Game4Screen';
import ProfileScreen from './app/screens/ProfileScreen';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

function ProfileButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name="person-outline" size={24} color="black" style={styles.profileIcon} />
    </TouchableOpacity>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="GameSelection"
          component={GameSelectionScreen}
          options={({ navigation }) => ({
            title: 'Game Selection',
            headerRight: () => (
              <ProfileButton onPress={() => navigation.navigate('Profile')} />
            ),
          })}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Quiz Game" component={Game1Screen} />
        <Stack.Screen name="Sudoku" component={Game2Screen} />
        <Stack.Screen name="Memory Game" component={Game3Screen} />
        <Stack.Screen name="2048" component={Game4Screen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  profileIcon: {
    marginRight: 15,
  },
});

export default App;
