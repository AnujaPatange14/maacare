import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const {
  currentUser,
  logout,
  isOnline,
  parentPin,
  createParentPin,
  verifyParentPin,
  executePendingAction,
  setPendingAction,
  pendingAction,
} = useApp();
React.useEffect(() => {
  console.log("Settings pendingAction =", pendingAction);
}, [pendingAction]);
const [pin, setPin] = React.useState('');
const [confirmPin, setConfirmPin] = React.useState('');

 const handleLogout = async () => {
  await logout();
};

  return (
    <ScreenLayout>
      <Text style={styles.emoji}>⚙️</Text>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
  <Text style={styles.cardTitle}>🔒 Parent Access</Text>

  {!parentPin ? (
    <>
      <Text style={styles.aboutText}>
        Create a 4-digit PIN to protect parent features.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm PIN"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={confirmPin}
        onChangeText={setConfirmPin}
      />

      <CustomButton
        title="Create PIN"
        onPress={async () => {
          if (pin.length !== 4) {
            Alert.alert("PIN must be 4 digits");
            return;
          }

          if (pin !== confirmPin) {
            Alert.alert("PINs do not match");
            return;
          }

          await createParentPin(pin);

          Alert.alert("PIN created");
        }}
      />
    </>
  ) : (
    <>
      <Text style={styles.aboutText}>
        Enter your Parent PIN.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Parent PIN"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
      />

      <CustomButton
        title="Unlock"
        onPress={async () => {
          const ok = verifyParentPin(pin);

          if (!ok) {
            Alert.alert("Incorrect PIN");
            return;
          }

          setPin("");

          await executePendingAction(navigation);

          Alert.alert("Parent verified");
        }}
      />
    </>
  )}
</View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{currentUser?.name || '—'}</Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{currentUser?.email || '—'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connection</Text>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.label}>Server</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={[styles.value, isOnline ? styles.online : styles.offline]}>
              {isOnline ? 'Connected' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.aboutText}>
          MaaCare helps parents build healthy daily routines for children through morning and
          night task tracking, progress insights, and reward badges.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <CustomButton
        title="Log Out"
        onPress={handleLogout}
        variant="secondary"
        style={styles.logoutButton}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: {
    ...typography.h1,
    color: colors.textDark,
    textAlign: 'center',
    fontSize: 28,
    marginBottom: spacing.lg,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: { ...typography.body, color: colors.textLight },
  value: { ...typography.bodyBold, color: colors.textDark },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  onlineDot: { backgroundColor: colors.successDark },
  offlineDot: { backgroundColor: colors.errorText },
  online: { color: colors.successDark },
  offline: { color: colors.errorText },
  apiUrl: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  version: { ...typography.caption, color: colors.textLight },
  logoutButton: { marginTop: spacing.sm },
  input: {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 12,
  padding: 14,
  marginBottom: spacing.md,
  color: colors.textDark,
},
});
