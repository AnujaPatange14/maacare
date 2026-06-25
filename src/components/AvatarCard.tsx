import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Avatar } from '../data/dummyData';

interface AvatarCardProps {
  avatar: Avatar;
  isSelected: boolean;
  onPress: () => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({ avatar, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{avatar.emoji}</Text>
      <Text style={[styles.name, isSelected && styles.selectedName]}>{avatar.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.accent,
    backgroundColor: colors.primaryLight,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.caption,
    color: colors.text,
  },
  selectedName: {
    color: colors.accent,
    fontWeight: '600',
  },
});
