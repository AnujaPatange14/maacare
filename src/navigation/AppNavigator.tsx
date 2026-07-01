import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RoutineScreen } from '../screens/RoutineScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcon = (emoji: string, focused: boolean) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        paddingBottom: Platform.OS === 'web' ? 12 : 8,
        paddingTop: 8,
        height: Platform.OS === 'web' ? 68 : 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('🏠', focused),
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Routine"
      component={RoutineScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('✅', focused),
        tabBarLabel: 'Routine',
      }}
    />
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('📊', focused),
        tabBarLabel: 'Progress',
      }}
    />
    <Tab.Screen
      name="Rewards"
      component={RewardsScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('🏆', focused),
        tabBarLabel: 'Rewards',
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('⚙️', focused),
        tabBarLabel: 'Settings',
      }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen
      name="RoutineDetail"
      component={RoutineScreen}
      options={{ presentation: 'card' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isLoggedIn, children, currentChildId, isHydrated } = useApp();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  const showApp = isLoggedIn && children.length > 0 && !!currentChildId;
  const showOnboarding = isLoggedIn && !showApp;

  return (
    <NavigationContainer>
      {showApp ? <AppStack /> : showOnboarding ? <OnboardingStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
