// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert('Login gagal', e.message);
    }
  };

  const handleBiometric = async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    
    // Nanti ini yang dimatiin buat Demo, biar bisa login manual dulu, baru coba biometric
    if (!token) {
      Alert.alert('Belum ada session', 'Silakan login dulu dengan password.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login dengan biometric',
      fallbackLabel: 'Gunakan password',
    });

    if (result.success) {
      Alert.alert('Berhasil', 'Welcome back!');
      // Karena token valid dan state persistence aktif,
      // AuthContext akan me-reload dan otomatis mengarahkan ke HomeScreen.
    } else {
      Alert.alert('Gagal', 'Biometric tidak cocok.');
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 15, paddingBottom: 5 }}
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20, paddingBottom: 5 }}
      />
      
      <View style={{ marginBottom: 10 }}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      
      <View style={{ marginBottom: 20 }}>
        <Button title="Login dengan Biometrik" onPress={handleBiometric} color="green" />
      </View>

      <Text 
        style={{ textAlign: 'center', marginTop: 10, color: '#0066cc' }} 
        onPress={() => navigation.navigate('Register')}>
        Belum punya akun? Daftar
      </Text>
      <Text 
        style={{ textAlign: 'center', marginTop: 15, color: '#0066cc' }} 
        onPress={() => navigation.navigate('ForgotPassword')}>
        Lupa password?
      </Text>
    </View>
  );
}