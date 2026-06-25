import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { AvatarCard } from '../components/AvatarCard';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { avatars } from '../data/dummyData';

interface CreateAvatarScreenProps {
  navigation: any;
}

export const CreateAvatarScreen: React.FC<CreateAvatarScreenProps> = ({ navigation }) => {
  const { selectedAvatar, setSelectedAvatar } = useApp();

  return (
    <ScreenLayout>
      <Text style={styles.emoji}>🎭</Text>
      <Text style={styles.title}>Choose Your Buddy</Text>
      <Text style={styles.subtitle}>Pick an avatar for your child</Text>

      <View style={styles.avatarGrid}>
        {avatars.map(avatar => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatar?.id === avatar.id}
            onPress={() => setSelectedAvatar(avatar)}
          />
        ))}
      </View>

      <CustomButton
        title="Continue"
        onPress={() => navigation.navigate('ProfileSetup')}
        style={styles.button}
        disabled={!selectedAvatar}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    textAlign: 'center',
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
