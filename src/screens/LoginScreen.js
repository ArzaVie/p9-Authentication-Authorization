import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Setup Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '314414973409-vqb375f3nous6a3ajomqsbbvotost5q3.apps.googleusercontent.com',
    webClientId: '314414973409-vqb375f3nous6a3ajomqsbbvotost5q3.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      scheme: 'authpraktikum',  
    })
  });

  // Effect untuk menangkap respon setelah user milih akun Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      
      // Login ke Firebase pakai kredensial Google
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Sukses', 'Berhasil login dengan Google!');
        })
        .catch((error) => {
          Alert.alert('Google Login Gagal', error.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert('Login gagal', e.message);
    }
  };

  const handleBiometric = async () => {
    const token = await SecureStore.getItemAsync('auth_token');

    //Nanti ini dihide buat pake sidik jari.
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
      
      <View style={{ marginBottom: 10 }}>
        <Button title="Login dengan Biometrik" onPress={handleBiometric} color="green" />
      </View>

      {/* Tombol Login Google Baru */}
      <View style={{ marginBottom: 20 }}>
        <Button 
          title="Login dengan Google" 
          onPress={() => promptAsync()} 
          disabled={!request} 
          color="#DB4437" // Warna khas Google
        />
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