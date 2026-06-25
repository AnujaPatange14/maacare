import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TaskItem } from '../components/TaskItem';
import { ProgressBar } from '../components/ProgressBar';
import { AddTaskModal } from '../components/AddTaskModal';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { Task } from '../data/dummyData';

interface RoutineScreenProps {
  navigation: any;
  route: any;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({ route, navigation }) => {
  const { morningTasks, nightTasks, updateTask, addTask, editTask, deleteTask } = useApp();
  const routeCategory = route.params?.category;
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'night'>(
    routeCategory || 'morning'
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Use route param if available, otherwise use state
  const currentCategory = routeCategory || selectedCategory;
  const tasks = currentCategory === 'morning' ? morningTasks : nightTasks;
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const title = currentCategory === 'morning' ? 'Morning Routine' : 'Night Routine';

  const handleBackPress = () => {
    if (route.name === 'RoutineDetail') {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };


  const handleToggleTask = (task: Task) => {
    updateTask(task.id, !task.completed);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

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
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>
                  Complete your tasks for today
                </Text>
              </View>
            </View>

            {!routeCategory && (
              <View style={styles.categorySelector}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === 'morning' && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory('morning')}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === 'morning' && styles.categoryButtonTextActive,
                    ]}
                  >
                    🌅 Morning
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === 'night' && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory('night')}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === 'night' && styles.categoryButtonTextActive,
                    ]}
                  >
                    🌙 Night
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.card}>
              <ProgressBar
                progress={progress}
                label="Overall Progress"
                showPercentage={true}
              />
              <Text style={styles.progressText}>
                {completed} of {total} tasks completed
              </Text>
            </View>

            <View style={styles.tasksContainer}>
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleTask(task)}
                  onLongPress={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditingTask(null);
                setShowAddModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+ Add New Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      <AddTaskModal
        visible={showAddModal}
        onClose={handleCloseModal}
        category={currentCategory}
        onSave={addTask}
        editingTask={editingTask}
        onUpdate={editTask}
        onDelete={deleteTask}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
  },
  backArrow: {
    fontSize: 28,
    color: colors.textDark,
  },
  headerTextContainer: {
    flex: 1,
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
  progressText: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  tasksContainer: {
    marginTop: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 18,
  },
  categorySelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xs,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: colors.accent,
  },
  categoryButtonText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
});
