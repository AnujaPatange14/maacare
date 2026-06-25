import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from '../components/ProgressBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';

interface ProgressScreenProps {
  navigation: any;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const { morningTasks, nightTasks, weeklyProgress } = useApp();

  const stats = useMemo(() => {
    const completedMorning = morningTasks.filter(t => t.completed).length;
    const completedNight = nightTasks.filter(t => t.completed).length;
    const totalMorning = morningTasks.length;
    const totalNight = nightTasks.length;
    const totalTasks = totalMorning + totalNight;
    const totalCompleted = completedMorning + completedNight;
    const overallProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
    const morningProgress = totalMorning > 0 ? (completedMorning / totalMorning) * 100 : 0;
    const nightProgress = totalNight > 0 ? (completedNight / totalNight) * 100 : 0;

    return {
      overallProgress,
      morningProgress,
      nightProgress,
      totalCompleted,
      totalTasks,
      completedMorning,
      totalMorning,
      completedNight,
      totalNight,
    };
  }, [morningTasks, nightTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.emoji}>📊</Text>
              <Text style={styles.title}>Your Progress</Text>
              <Text style={styles.subtitle}>
                Track your daily achievements
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Overall Progress</Text>
              <View style={styles.percentageContainer}>
                <Text style={styles.percentage}>{Math.round(stats.overallProgress)}%</Text>
              </View>
              <ProgressBar
                progress={stats.overallProgress}
                showPercentage={false}
              />
              <Text style={styles.statsText}>
                {stats.totalCompleted} of {stats.totalTasks} tasks completed today
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌅 Morning Routine</Text>
              <ProgressBar
                progress={stats.morningProgress}
                label={`${stats.completedMorning} / ${stats.totalMorning} tasks`}
                showPercentage={true}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌙 Night Routine</Text>
              <ProgressBar
                progress={stats.nightProgress}
                label={`${stats.completedNight} / ${stats.totalNight} tasks`}
                showPercentage={true}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weekly Summary</Text>
              <View style={styles.weeklyContainer}>
                {(weeklyProgress.length > 0
                  ? weeklyProgress
                  : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => ({
                      label,
                      progress: 0,
                    }))
                ).map((day, index) => (
                  <View key={`${day.label}-${index}`} style={styles.dayItem}>
                    <Text style={styles.dayLabel}>{day.label}</Text>
                    <View style={styles.dayBar}>
                      <View
                        style={[
                          styles.dayBarFill,
                          { width: `${day.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.dayPercent}>{day.progress}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  percentage: {
    ...typography.h1,
    color: colors.accent,
    fontSize: 48,
  },
  statsText: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  weeklyContainer: {
    marginTop: spacing.sm,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.text,
    width: 40,
  },
  dayBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    marginLeft: spacing.md,
    overflow: 'hidden',
  },
  dayBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  dayPercent: {
    ...typography.small,
    color: colors.textLight,
    width: 36,
    textAlign: 'right',
    marginLeft: spacing.xs,
  },
});
