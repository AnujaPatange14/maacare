import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Task } from '../data/dummyData';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onLongPress, onDelete }) => {
  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.content}
        onPress={onToggle}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{task.icon}</Text>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.rightSection}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 18,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: colors.primaryLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  title: {
    ...typography.body,
    color: colors.textDark,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
  },
  checkmark: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  deleteText: {
    ...typography.small,
    color: '#FF6B6B',
  },
});
