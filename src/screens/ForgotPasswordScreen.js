import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Peringatan', 'Masukkan email terlebih dahulu');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sukses', 'Email reset password telah dikirim');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        placeholder="Masukkan Email Anda" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" 
      />
      <Button title="Kirim Email Reset" onPress={handleReset} />
    </View>
  );
}