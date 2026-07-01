import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { api } from '../services/api';

export const ForgotPasswordScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return Alert.alert('Enter email', 'Please enter your account email.');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email.trim());
      if (res.token) {
        // dev mode: navigate to reset with token
        navigation.navigate('ResetPassword', { token: res.token });
      } else {
        Alert.alert('Check your inbox', 'If an account exists, a reset link has been sent.');
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <Text style={styles.emoji}>🔐</Text>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your account email to receive reset instructions.</Text>

      <View style={{ width: '100%', marginTop: spacing.md }}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomButton title={loading ? 'Please wait...' : 'Send reset email'} onPress={handleSend} style={{ marginTop: spacing.md }} disabled={loading} />
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
