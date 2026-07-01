import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { CustomButton } from './CustomButton';

interface ChildSwitcherProps {
  navigation: any;
}

export const ChildSwitcher: React.FC<ChildSwitcherProps> = ({ navigation }) => {
  const { children, currentChildId, setCurrentChildId, childProfile, deleteChild } = useApp();
  const [showModal, setShowModal] = React.useState(false);

  const handleSwitchChild = (childId: string) => {
    setCurrentChildId(childId);
    setShowModal(false);
  };

  const handleDeleteChild = async (childId: string) => {
    const child = children.find(c => c.id === childId);
    Alert.alert(
      'Delete Child',
      child ? `Delete ${child.name} and all their tasks?` : 'Delete this child and all their tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChild(childId);
              // close modal after deletion
              if (children.length <= 1) {
                setShowModal(false);
              }
            } catch {
              // error handled in context
            }
          },
        },
      ]
    );
  };

  const handleAddNewChild = () => {
    setShowModal(false);
    Alert.alert('Parent access', 'Please log in as a parent to add a new child.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log in',
        onPress: () => navigation.navigate('Login', { redirectTo: 'ProfileSetup', parentAccess: true }),
      },
    ]);
  };

  if (children.length === 0) return null;

  const currentChild = childProfile;

  return (
    <>
      <TouchableOpacity
        style={styles.switcherButton}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.switcherContent}>
          {currentChild?.photoUri ? (
            <Image source={{ uri: currentChild.photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarEmoji}>{currentChild?.avatar?.emoji || '⭐'}</Text>
          )}
          <View style={styles.switcherText}>
            <Text style={styles.childName}>{currentChild?.name || 'Select Child'}</Text>
            {children.length > 1 && (
              <Text style={styles.switchHint}>Tap to switch • {children.length} children</Text>
            )}
          </View>
          <Text style={styles.chevron}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Child</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.childrenList}>
              {children.map(child => (
                <View
                  key={child.id}
                  style={[
                    styles.childItem,
                    currentChildId === child.id && styles.childItemActive,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.childMain}
                    onPress={() => handleSwitchChild(child.id)}
                    activeOpacity={0.7}
                  >
                    {child.photoUri ? (
                      <Image source={{ uri: child.photoUri }} style={styles.childAvatarImage} />
                    ) : (
                      <Text style={styles.childAvatar}>{child.avatar?.emoji || '⭐'}</Text>
                    )}
                    <View style={styles.childInfo}>
                      <Text
                        style={[
                          styles.childItemName,
                          currentChildId === child.id && styles.childItemNameActive,
                        ]}
                      >
                        {child.name}
                      </Text>
                      <Text style={styles.childItemAge}>
                        {child.age} years old • {child.gender}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.childActions}>
                    {currentChildId === child.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                   
                    <TouchableOpacity
                      onPress={() => handleDeleteChild(child.id)}
                      style={styles.deleteChildButton}
                    >
                      <Text style={styles.deleteChildText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <CustomButton
                title="+ Add New Child"
                onPress={handleAddNewChild}
                variant="secondary"
                style={styles.addButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  switcherButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switcherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  avatarEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  switcherText: {
    flex: 1,
  },
  childName: {
    ...typography.bodyBold,
    color: colors.textDark,
  },
  switchHint: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs / 2,
  },
  chevron: {
    fontSize: 16,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
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
  childrenList: {
    maxHeight: 400,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
    marginBottom: spacing.sm,
    backgroundColor: colors.primaryLight,
  },
  childItemActive: {
    backgroundColor: colors.accent,
  },
  childAvatar: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  childAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  childInfo: {
    flex: 1,
  },
  childMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  childItemName: {
    ...typography.bodyBold,
    color: colors.textDark,
    marginBottom: spacing.xs / 2,
  },
  childItemNameActive: {
    color: colors.white,
  },
  childItemAge: {
    ...typography.caption,
    color: colors.textLight,
  },
  checkmark: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  deleteChildButton: {
    marginTop: spacing.xs,
  },
  deleteChildText: {
    ...typography.small,
    color: '#FF6B6B',
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    width: '100%',
  },
});
