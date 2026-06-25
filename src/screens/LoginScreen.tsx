import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { ErrorBanner } from '../components/ErrorBanner';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { ApiError } from '../services/api';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { registerUser, loginUser, isLoading, isOnline, error, clearError } = useApp();

  const handleSubmit = async () => {
    clearError();

    if (mode === 'signup') {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
        Alert.alert('Missing information', 'Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Password too short', 'Password should be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match', 'Please make sure both passwords match.');
        return;
      }

      try {
        await registerUser(trimmedName, trimmedEmail, password);
      } catch (e) {
        const message = e instanceof ApiError ? e.message : 'Registration failed';
        Alert.alert('Sign up failed', message);
      }
    } else {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        Alert.alert('Missing information', 'Please enter your email and password.');
        return;
      }

      const result = await loginUser(trimmedEmail, password);
      if (!result.success) {
        Alert.alert('Login failed', error || 'Email or password is incorrect.');
      }
    }
  };

  return (
    <ScreenLayout contentStyle={styles.content}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Text style={styles.emoji}>👨‍👩‍👧‍👦</Text>
        <Text style={styles.title}>
          {mode === 'signup' ? 'Create Parent Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'signup'
            ? 'Your family data is securely saved in the cloud'
            : 'Log in to continue your family routines'}
        </Text>

        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              Cannot reach the server. Start it locally with npm run server, or check your API URL.
            </Text>
          </View>
        )}

        <ErrorBanner message={error} onDismiss={clearError} />

        <View style={styles.inputContainer}>
          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          )}
        </View>

        <CustomButton
          title={isLoading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
          onPress={handleSubmit}
          style={styles.button}
          disabled={isLoading || !isOnline}
        />

        {isLoading && <ActivityIndicator color={colors.accent} style={styles.loader} />}

        <TouchableOpacity
          onPress={() => {
            clearError();
            setMode(prev => (prev === 'signup' ? 'login' : 'signup'));
          }}
          disabled={isLoading}
        >
          <Text style={styles.switchModeText}>
            {mode === 'signup'
              ? 'Already have an account? Log in'
              : 'New here? Create an account'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontSize: 28,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  offlineBanner: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
    width: '100%',
  },
  offlineText: {
    ...typography.small,
    color: colors.warningText,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.body,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: '100%',
  },
  loader: {
    marginTop: spacing.sm,
  },
  switchModeText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.accent,
    textAlign: 'center',
  },
});
