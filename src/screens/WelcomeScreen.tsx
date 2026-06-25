import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface WelcomeScreenProps {
  navigation: any;
}

const FEATURES = [
  { emoji: '🌅', text: 'Morning & night routines' },
  { emoji: '📊', text: 'Track daily progress' },
  { emoji: '🏆', text: 'Earn reward badges' },
  { emoji: '👨‍👩‍👧', text: 'Manage multiple children' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => (
  <ScreenLayout scrollable={false} contentStyle={styles.content}>
    <View style={styles.hero}>
      <View style={styles.brandBadge}>
        <Text style={styles.brandEmoji}>💜</Text>
      </View>
      <Text style={styles.appName}>MaaCare</Text>
      <Text style={styles.tagline}>Gentle routines for growing hearts</Text>
    </View>

    <View style={styles.featureList}>
      {FEATURES.map(item => (
        <View key={item.text} style={styles.featureRow}>
          <Text style={styles.featureEmoji}>{item.emoji}</Text>
          <Text style={styles.feature}>{item.text}</Text>
        </View>
      ))}
    </View>

    <CustomButton
      title="Get Started"
      onPress={() => navigation.navigate('Login')}
      style={styles.button}
    />
    <Text style={styles.footer}>Made with love for parents & children</Text>
  </ScreenLayout>
);

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  brandEmoji: {
    fontSize: 48,
  },
  appName: {
    ...typography.h1,
    color: colors.textDark,
    fontSize: 42,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 17,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureEmoji: {
    fontSize: 20,
    width: 32,
  },
  feature: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  button: {
    width: '100%',
    maxWidth: 320,
  },
  footer: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.lg,
  },
});
