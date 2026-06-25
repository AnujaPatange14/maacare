import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  emoji?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, emoji }) => (
  <View style={styles.card}>
    {emoji && <Text style={styles.emoji}>{emoji}</Text>}
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: colors.accent,
    marginBottom: spacing.xs / 2,
  },
  label: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
  },
});
