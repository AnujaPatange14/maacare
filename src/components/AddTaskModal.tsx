import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { CustomButton } from './CustomButton';
import { Task } from '../data/dummyData';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  category: 'morning' | 'night';
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  editingTask?: Task | null;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

const commonIcons = [
  '🦷', '💧', '👕', '🍳', '🎒', '📚', '🧸', '🛁','🌅','🌙',
  '😴', '📖', '🎨', '🏃', '🍎', '🧹', '📝', '🎵', '🎮', '⚽',
  '🧘', '💤', '🌟', '❤️', '👍', '🎯', '🏆', '⭐', '🌈', '☀️',
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  category,
  onSave,
  editingTask,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [selectedIcon, setSelectedIcon] = useState(editingTask?.icon || '⭐');

  const isEditing = !!editingTask;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (isEditing && editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: title.trim(),
        icon: selectedIcon,
      });
    } else {
      onSave({
        title: title.trim(),
        icon: selectedIcon,
        category,
      });
    }
    
    setTitle('');
    setSelectedIcon('⭐');
    onClose();
  };

  const handleDelete = () => {
    if (editingTask && onDelete) {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              onDelete(editingTask.id);
              setTitle('');
              setSelectedIcon('⭐');
              onClose();
            },
          },
        ]
      );
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedIcon('⭐');
    onClose();
  };

  React.useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSelectedIcon(editingTask.icon);
    } else {
      setTitle('');
      setSelectedIcon('⭐');
    }
  }, [editingTask, visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                placeholderTextColor={colors.textLight}
                value={title}
                onChangeText={setTitle}
                autoFocus={!isEditing}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Choose Icon</Text>
              <View style={styles.iconGrid}>
                {commonIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon && styles.iconButtonSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryDisplay}>
                <Text style={styles.categoryText}>
                  {category === 'morning' ? 'Morning Routine' : 'Night Routine'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            {isEditing && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete Task</Text>
              </TouchableOpacity>
            )}
            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                onPress={handleClose}
                variant="secondary"
                style={styles.cancelButton}
              />
              <CustomButton
                title={isEditing ? 'Update' : 'Add Task'}
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textDark,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
    padding: spacing.md,
    ...typography.body,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  iconText: {
    fontSize: 24,
  },
  categoryDisplay: {
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
    padding: spacing.md,
  },
  categoryText: {
    ...typography.body,
    color: colors.textDark,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deleteButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
