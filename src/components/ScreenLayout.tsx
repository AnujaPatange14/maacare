import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ScreenLayoutProps {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  gradient?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = true,
  contentStyle,
  gradient = true,
}) => {
  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.inner, styles.flex, contentStyle]}>{children}</View>
  );

  const body = (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {inner}
    </SafeAreaView>
  );

  if (!gradient) {
    return <View style={styles.plain}>{body}</View>;
  }

  return (
    <LinearGradient colors={[colors.primary, colors.primaryLight, colors.background]} style={styles.flex}>
      {body}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  plain: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    ...(Platform.OS === 'web' ? { minHeight: '100%' as unknown as number } : {}),
  },
});
