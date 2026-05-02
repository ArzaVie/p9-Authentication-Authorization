import React, { useEffect, useRef } from 'react';
import { AppState, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function Root() {
  const { user, loading, logout } = useAuth();
  const waktuMasukBackground = useRef(null);

  useEffect(() => {
    if (!user) return;

    const subscription = AppState.addEventListener('change', nextAppState => {
      // Pas aplikasi ketutup ke background
      if (nextAppState === 'background') {
        waktuMasukBackground.current = Date.now();
      } 
      // Pas aplikasi dibuka lagi ke layar
      else if (nextAppState === 'active') {
        if (waktuMasukBackground.current) {
          const selisihDetik = (Date.now() - waktuMasukBackground.current) / 1000;
          
          // Kalau lebih dari 10 detik, sikat!
          if (selisihDetik >= 10) {
            logout();
            Alert.alert('Sesi Habis', 'Anda otomatis logout karena aplikasi ditinggalkan lebih dari 10 detik.');
          }
          waktuMasukBackground.current = null; // Reset waktunya
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user, logout]);

  if (loading) return null;
  
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}