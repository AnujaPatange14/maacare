import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ProgressBar } from '../components/ProgressBar';
import { ChildSwitcher } from '../components/ChildSwitcher';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { affirmations } from '../data/dummyData';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { childProfile, morningTasks, nightTasks, streakStats } = useApp();

  const completedMorning = morningTasks.filter(t => t.completed).length;
  const completedNight = nightTasks.filter(t => t.completed).length;
  const totalMorning = morningTasks.length;
  const totalNight = nightTasks.length;
  const morningProgress = totalMorning > 0 ? (completedMorning / totalMorning) * 100 : 0;
  const nightProgress = totalNight > 0 ? (completedNight / totalNight) * 100 : 0;
  const overallProgress =
    totalMorning + totalNight > 0
      ? ((completedMorning + completedNight) / (totalMorning + totalNight)) * 100
      : 0;

  const childName = childProfile?.name || 'Buddy';
  const avatarEmoji = childProfile?.avatar?.emoji || '⭐';
  const photoUri = childProfile?.photoUri;

  const todayIndex = new Date().getDate() % affirmations.length;
  const dailyAffirmation = affirmations[todayIndex];

  return (
    <ScreenLayout>
      <ChildSwitcher navigation={navigation} />

      <View style={styles.headerSection}>
        <Text style={styles.greeting}>Hello, {childName} 👋</Text>
        <View style={styles.avatarContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <Text style={styles.overallPercent}>{Math.round(overallProgress)}%</Text>
        <ProgressBar progress={overallProgress} showPercentage={false} />
        <View style={styles.progressSection}>
          <ProgressBar progress={morningProgress} label="Morning" showPercentage />
          <ProgressBar progress={nightProgress} label="Night" showPercentage />
        </View>
        {streakStats && streakStats.currentStreak > 0 && (
          <Text style={styles.streakText}>
            🔥 {streakStats.currentStreak}-day streak — keep it going!
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌅 Morning Routine</Text>
        <Text style={styles.cardSubtitle}>
          {completedMorning} of {totalMorning} tasks completed
        </Text>
        <CustomButton
          title="View Morning Tasks"
          onPress={() => navigation.navigate('RoutineDetail', { category: 'morning' })}
          variant="secondary"
          style={styles.cardButton}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌙 Night Routine</Text>
        <Text style={styles.cardSubtitle}>
          {completedNight} of {totalNight} tasks completed
        </Text>
        <CustomButton
          title="View Night Tasks"
          onPress={() => navigation.navigate('RoutineDetail', { category: 'night' })}
          variant="secondary"
          style={styles.cardButton}
        />
      </View>

      <View style={[styles.card, styles.affirmationCard]}>
        <Text style={styles.cardTitle}>Daily Affirmation</Text>
        <Text style={styles.affirmation}>{dailyAffirmation}</Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover',
  },
  avatarEmoji: {
    fontSize: 52,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  affirmationCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  overallPercent: {
    ...typography.h1,
    color: colors.accent,
    fontSize: 36,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  streakText: {
    ...typography.caption,
    color: colors.successDark,
    textAlign: 'center',
    marginTop: spacing.md,
    fontWeight: '600',
  },
  cardButton: {
    marginTop: spacing.xs,
  },
  affirmation: {
    ...typography.body,
    color: colors.textDark,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 26,
  },
});
