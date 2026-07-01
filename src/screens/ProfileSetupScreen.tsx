import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { AvatarCard } from '../components/AvatarCard';
import { avatars } from '../data/dummyData';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';

export const ProfileSetupScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const { selectedAvatar, addChild, setSelectedAvatar, isLoading } = useApp();

  const handleContinue = async () => {
    if (
    name.trim() &&
    age &&
    gender &&
    (selectedAvatar || photoUri)
){
      try {
        await addChild({
          name: name.trim(),
          age: parseInt(age, 10),
          gender,
          avatar: selectedAvatar,
          photoUri,
        });
        setSelectedAvatar(null);
        navigation.reset({
  index: 0,
  routes: [{ name: 'MainTabs' }],
});
      
      } catch {
        Alert.alert('Error', 'Could not save profile. Please try again.');
      }
    }
  };

  const ages = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const genders = ['Boy', 'Girl', 'Other'];

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos so you can upload one.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        const uri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setSelectedAvatar(null);
        setPhotoUri(uri);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong while picking the photo.');
    }
  };

  return (
    <ScreenLayout>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Setup Profile</Text>
      <Text style={styles.subtitle}>Tell us about your child</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <View style={styles.ageContainer}>
          {ages.map(ageOption => (
            <TouchableOpacity
              key={ageOption}
              style={[styles.chip, age === ageOption && styles.chipSelected]}
              onPress={() => setAge(ageOption)}
            >
              <Text style={[styles.chipText, age === ageOption && styles.chipTextSelected]}>
                {ageOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {genders.map(genderOption => (
            <TouchableOpacity
              key={genderOption}
              style={[styles.genderButton, gender === genderOption && styles.chipSelected]}
              onPress={() => setGender(genderOption)}
            >
              <Text style={[styles.chipText, gender === genderOption && styles.chipTextSelected]}>
                {genderOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Photo (Optional)</Text>
        <TouchableOpacity style={styles.photoButton} onPress={handlePickPhoto}>
          <Text style={styles.photoButtonText}>
            {photoUri ? 'Change Photo' : '📷 Upload Photo'}
          </Text>
        </TouchableOpacity>
        {photoUri && (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          </View>
        )}
      </View>
     <Text style={styles.orText}>
──────── OR ────────
</Text>

<Text style={styles.label}>
Choose an Avatar
</Text>

<View style={styles.avatarGrid}>
  {avatars.map(avatar => (
    <AvatarCard
      key={avatar.id}
      avatar={avatar}
      isSelected={selectedAvatar?.id === avatar.id}
      onPress={() => {
        setPhotoUri(undefined);
        setSelectedAvatar(avatar);
      }}
    />
  ))}
</View>
      <CustomButton
        title={isLoading ? 'Saving...' : 'Complete Setup'}
        onPress={handleContinue}
        style={styles.button}
        disabled={isLoading || !name.trim() || !age || !gender ||( !selectedAvatar && !photoUri)}
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
  avatarGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: spacing.sm,
  marginBottom: spacing.lg,
},
orText: {
  ...typography.caption,
  color: colors.textLight,
  textAlign: 'center',
  marginVertical: spacing.md,
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
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.body,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.body,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonText: {
    ...typography.body,
    color: colors.accent,
  },
  photoPreviewContainer: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  photoPreview: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  button: {
    marginTop: spacing.sm,
  },
});
