import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { StatCard } from '../components/StatCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';

interface Reward {
  id: string;
  title: string;
  emoji: string;
  description: string;
  earned: boolean;
}

export const RewardsScreen: React.FC = () => {
  const { morningTasks, nightTasks, streakStats } = useApp();

  const completedMorning = morningTasks.filter(t => t.completed).length;
  const completedNight = nightTasks.filter(t => t.completed).length;
  const totalCompleted = completedMorning + completedNight;
  const totalTasks = morningTasks.length + nightTasks.length;

  const currentStreak = streakStats?.currentStreak ?? 0;
  const perfectStreak = streakStats?.perfectStreak ?? 0;

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Early Bird',
      emoji: '🌅',
      description: 'Complete morning routine',
      earned: completedMorning === morningTasks.length && morningTasks.length > 0,
    },
    {
      id: '2',
      title: 'Night Owl',
      emoji: '🌙',
      description: 'Complete night routine',
      earned: completedNight === nightTasks.length && nightTasks.length > 0,
    },
    {
      id: '3',
      title: 'Super Star',
      emoji: '⭐',
      description: 'Complete all tasks today',
      earned: totalCompleted === totalTasks && totalTasks > 0,
    },
    {
      id: '4',
      title: 'Week Warrior',
      emoji: '🏆',
      description: '7-day activity streak',
      earned: currentStreak >= 7,
    },
    {
      id: '5',
      title: 'Perfect Week',
      emoji: '💎',
      description: '7 perfect days in a row',
      earned: perfectStreak >= 7,
    },
    {
      id: '6',
      title: 'Habit Master',
      emoji: '👑',
      description: '30-day activity streak',
      earned: currentStreak >= 30,
    },
  ];

  const earnedCount = rewards.filter(r => r.earned).length;

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>
          {earnedCount} of {rewards.length} badges earned
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard emoji="🔥" label="Day streak" value={currentStreak} />
        <StatCard emoji="💎" label="Perfect streak" value={perfectStreak} />
        <StatCard emoji="⭐" label="Today" value={`${totalCompleted}/${totalTasks}`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Badges</Text>
        <View style={styles.badgesContainer}>
          {rewards.map(reward => (
            <View
              key={reward.id}
              style={[styles.badge, reward.earned && styles.badgeEarned]}
            >
              <Text style={[styles.badgeEmoji, !reward.earned && styles.locked]}>{reward.emoji}</Text>
              <Text style={[styles.badgeTitle, !reward.earned && styles.badgeTitleLocked]}>
                {reward.title}
              </Text>
              <Text style={[styles.badgeDescription, !reward.earned && styles.badgeDescriptionLocked]}>
                {reward.description}
              </Text>
              {reward.earned && (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>Earned</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xs,
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
  cardTitle: {
    ...typography.h3,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: '48%',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeEarned: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
  },
  badgeEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  locked: {
    opacity: 0.35,
  },
  badgeTitle: {
    ...typography.bodyBold,
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: colors.textLight,
  },
  badgeDescription: {
    ...typography.small,
    color: colors.text,
    textAlign: 'center',
  },
  badgeDescriptionLocked: {
    color: colors.textLight,
  },
  earnedBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.successDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
  },
  earnedText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
});
