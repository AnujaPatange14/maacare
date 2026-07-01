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
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? '🌞 Good Morning'
      : hour < 17
      ? '☀️ Good Afternoon'
      : '🌙 Good Evening';

  return (
    <ScreenLayout>
      <ChildSwitcher navigation={navigation} />

      <View style={styles.headerSection}>
        <Text style={styles.greeting}>
  {greeting}, {childName}!
</Text>
<Text style={styles.subtitle}>
  Let's complete today's routine! 🌟
</Text>
        <View style={styles.avatarContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Today's Progress</Text>

<Text style={styles.overallPercent}>
  {Math.round(overallProgress)}%
</Text>

<Text style={styles.progressSummary}>
  {completedMorning + completedNight} of {totalMorning + totalNight} tasks completed
</Text>

<ProgressBar
  progress={overallProgress}
  showPercentage={false}
/>

<View style={styles.statsContainer}>

  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>🌅</Text>
    <Text style={styles.statTitle}>Morning</Text>
    <Text style={styles.statValue}>
      {completedMorning}/{totalMorning}
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>🌙</Text>
    <Text style={styles.statTitle}>Night</Text>
    <Text style={styles.statValue}>
      {completedNight}/{totalNight}
    </Text>
  </View>

</View>

{streakStats && streakStats.currentStreak > 0 && (
  <View style={styles.streakCard}>
    <Text style={styles.streakEmoji}>🔥</Text>

    <View>
      <Text style={styles.streakTitle}>
        {streakStats.currentStreak} Day Streak
      </Text>

      <Text style={styles.streakSubtitle}>
        Keep it going!
      </Text>
    </View>
  </View>
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
  statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: spacing.lg,
},

statCard: {
  flex: 1,
  backgroundColor: colors.primaryLight,
  borderRadius: 16,
  padding: spacing.md,
  alignItems: 'center',
  marginHorizontal: spacing.xs,
},

statEmoji: {
  fontSize: 28,
},

statTitle: {
  ...typography.caption,
  color: colors.textLight,
  marginTop: spacing.xs,
},

statValue: {
  ...typography.h3,
  color: colors.accent,
  marginTop: spacing.xs,
},

streakCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFF4E5',
  borderRadius: 18,
  padding: spacing.md,
  marginTop: spacing.lg,
},

streakEmoji: {
  fontSize: 36,
  marginRight: spacing.md,
},

streakTitle: {
  ...typography.bodyBold,
  color: '#D97706',
},

streakSubtitle: {
  ...typography.caption,
  color: colors.textLight,
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
  subtitle: {
  ...typography.body,
  color: colors.textLight,
  textAlign: 'center',
  marginBottom: spacing.md,
},
  progressSummary: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
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
