import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { api } from '../services/api';

export const ResetPasswordScreen: React.FC = ({ route, navigation }: any) => {
  const [token, setToken] = useState(route?.params?.token || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token.trim() || !password) return Alert.alert('Missing', 'Please provide token and password');
    if (password !== confirm) return Alert.alert('Mismatch', 'Passwords do not match');
    setLoading(true);
    try {
      await api.resetPassword(token.trim(), password);
      Alert.alert('Success', 'Password updated — please log in.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <Text style={styles.emoji}>🔑</Text>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter the token you received and choose a new password.</Text>

      <View style={{ width: '100%', marginTop: spacing.md }}>
        <TextInput style={styles.input} placeholder="Reset token" value={token} onChangeText={setToken} autoCapitalize="none" />
        <TextInput style={[styles.input, { marginTop: spacing.sm }]} placeholder="New password" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={[styles.input, { marginTop: spacing.sm }]} placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} />

        <CustomButton title={loading ? 'Please wait...' : 'Set password'} onPress={handleReset} style={{ marginTop: spacing.md }} disabled={loading} />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textDark, textAlign: 'center', fontSize: 28, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textLight, textAlign: 'center', marginBottom: spacing.lg },
  input: { backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, ...typography.body, color: colors.textDark, borderWidth: 1, borderColor: colors.border },
});
