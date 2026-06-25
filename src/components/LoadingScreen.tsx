import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Loading MaaCare...',
}) => (
  <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.logo}>💜</Text>
      <Text style={styles.title}>MaaCare</Text>
      <Text style={styles.subtitle}>Building healthy routines together</Text>
      <ActivityIndicator size="large" color={colors.accent} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  message: {
    ...typography.caption,
    color: colors.textLight,
  },
});
