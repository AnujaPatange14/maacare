import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Task, morningTasks as defaultMorningTasks, nightTasks as defaultNightTasks } from '../data/dummyData';
import { api, ApiError, AuthUser, WeeklyDay, StreakStats } from '../services/api';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: Avatar | null;
  photoUri?: string;
  morningTasks: Task[];
  nightTasks: Task[];
}

interface AppContextType {
  children: ChildProfile[];
  currentChildId: string | null;
  setCurrentChildId: (id: string) => void;
  childProfile: ChildProfile | null;
  addChild: (profile: Omit<ChildProfile, 'id' | 'morningTasks' | 'nightTasks'>) => Promise<void>;
  updateChild: (id: string, updates: Partial<ChildProfile>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  selectedAvatar: Avatar | null;
  setSelectedAvatar: React.Dispatch<React.SetStateAction<Avatar | null>>;
  morningTasks: Task[];
  nightTasks: Task[];
  updateTask: (taskId: string, completed: boolean) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  currentUser: AuthUser | null;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; hasChildren: boolean }>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  weeklyProgress: WeeklyDay[];
  refreshWeeklyProgress: () => Promise<void>;
  streakStats: StreakStats | null;
  refreshStreakStats: () => Promise<void>;
  isOnline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'maacare_auth_token';
const CURRENT_CHILD_KEY = 'maacare_current_child';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [currentChildId, setCurrentChildIdState] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyDay[]>([]);
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const clearError = () => setError(null);

  const setCurrentChildId = useCallback(async (id: string) => {
    setCurrentChildIdState(id);
    await AsyncStorage.setItem(CURRENT_CHILD_KEY, id);
  }, []);

  const loadChildren = useCallback(async (token: string) => {
    const { children } = await api.getChildren(token);
    setChildrenList(children as ChildProfile[]);

    const storedChildId = await AsyncStorage.getItem(CURRENT_CHILD_KEY);
    const validChild = children.find(c => c.id === storedChildId);
    if (validChild) {
      setCurrentChildIdState(validChild.id);
    } else if (children.length > 0) {
      setCurrentChildIdState(children[0].id);
      await AsyncStorage.setItem(CURRENT_CHILD_KEY, children[0].id);
    } else {
      setCurrentChildIdState(null);
    }
    return children;
  }, []);

  const refreshWeeklyProgress = useCallback(async () => {
    if (!authToken || !currentChildId) {
      setWeeklyProgress([]);
      return;
    }
    try {
      const { days } = await api.getWeeklyProgress(authToken, currentChildId);
      setWeeklyProgress(days);
    } catch {
      setWeeklyProgress([]);
    }
  }, [authToken, currentChildId]);

  const refreshStreakStats = useCallback(async () => {
    if (!authToken || !currentChildId) {
      setStreakStats(null);
      return;
    }
    try {
      const { streaks } = await api.getStreaks(authToken, currentChildId);
      setStreakStats(streaks);
    } catch {
      setStreakStats(null);
    }
  }, [authToken, currentChildId]);

  useEffect(() => {
    const init = async () => {
      try {
        await api.health();
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }

      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const { user } = await api.me(token);
          setAuthToken(token);
          setCurrentUser(user);
          setLoggedIn(true);
          await loadChildren(token);
        }
      } catch {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsHydrated(true);
      }
    };

    init();
  }, [loadChildren]);

  useEffect(() => {
    if (isLoggedIn && currentChildId) {
      refreshWeeklyProgress();
      refreshStreakStats();
    }
  }, [isLoggedIn, currentChildId, refreshWeeklyProgress, refreshStreakStats]);

  const childProfile = useMemo(() => {
    if (!currentChildId) return null;
    return childrenList.find(child => child.id === currentChildId) || null;
  }, [currentChildId, childrenList]);

  const morningTasks = useMemo(() => {
    return childProfile?.morningTasks || defaultMorningTasks;
  }, [childProfile]);

  const nightTasks = useMemo(() => {
    return childProfile?.nightTasks || defaultNightTasks;
  }, [childProfile]);

  const syncChildTasks = (childId: string, task: Task) => {
    setChildrenList(prev =>
      prev.map(child => {
        if (child.id !== childId) return child;
        const updateList = (tasks: Task[]) =>
          tasks.map(t => (t.id === task.id ? task : t));
        if (task.category === 'morning') {
          return { ...child, morningTasks: updateList(child.morningTasks) };
        }
        return { ...child, nightTasks: updateList(child.nightTasks) };
      })
    );
  };

  const addChild = async (profileData: Omit<ChildProfile, 'id' | 'morningTasks' | 'nightTasks'>) => {
    if (!authToken) return;
    setIsLoading(true);
    setError(null);
   try {
    console.log("Creating child...");
  await api.createChild(authToken, profileData);
    console.log("Child created");
  // Reload children from the backend
  await loadChildren(authToken);
  const loaded = await loadChildren(authToken);
    console.log("Children after reload:", loaded);
} catch (e) {
  setError(e instanceof ApiError ? e.message : 'Failed to add child');
  throw e;
} finally {
  setIsLoading(false);
}
  };

  const updateChild = async (id: string, updates: Partial<ChildProfile>) => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const { child } = await api.updateChild(authToken, id, updates);
      setChildrenList(prev => prev.map(c => (c.id === id ? (child as ChildProfile) : c)));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update child');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChild = async (id: string) => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      await api.deleteChild(authToken, id);
      setChildrenList(prev => {
        const filtered = prev.filter(child => child.id !== id);
        if (id === currentChildId) {
          const nextId = filtered.length > 0 ? filtered[0].id : null;
          setCurrentChildIdState(nextId);
          if (nextId) AsyncStorage.setItem(CURRENT_CHILD_KEY, nextId);
          else AsyncStorage.removeItem(CURRENT_CHILD_KEY);
        }
        return filtered;
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete child');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, completed: boolean) => {
    if (!authToken || !currentChildId) return;
    try {
      const { task } = completed
        ? await api.updateTask(authToken, taskId, { completed: true })
        : await api.updateTask(authToken, taskId, { completed: false });
      syncChildTasks(currentChildId, task);
      await refreshWeeklyProgress();
      await refreshStreakStats();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update task');
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (!authToken || !currentChildId) return;
    try {
      const { task } = await api.createTask(authToken, currentChildId, taskData);
      setChildrenList(prev =>
        prev.map(child => {
          if (child.id !== currentChildId) return child;
          if (task.category === 'morning') {
            return { ...child, morningTasks: [...child.morningTasks, task] };
          }
          return { ...child, nightTasks: [...child.nightTasks, task] };
        })
      );
      await refreshWeeklyProgress();
      await refreshStreakStats();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add task');
    }
  };

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    if (!authToken || !currentChildId) return;
    try {
      const { task } = await api.updateTask(authToken, taskId, updates);
      syncChildTasks(currentChildId, task);
      await refreshWeeklyProgress();
      await refreshStreakStats();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to edit task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!authToken || !currentChildId) return;
    try {
      await api.deleteTask(authToken, taskId);
      setChildrenList(prev =>
        prev.map(child => {
          if (child.id !== currentChildId) return child;
          return {
            ...child,
            morningTasks: child.morningTasks.filter(t => t.id !== taskId),
            nightTasks: child.nightTasks.filter(t => t.id !== taskId),
          };
        })
      );
      await refreshWeeklyProgress();
      await refreshStreakStats();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete task');
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await api.register(name, email, password);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      setAuthToken(token);
      setCurrentUser(user);
      setLoggedIn(true);
      setChildrenList([]);
      setCurrentChildIdState(null);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Registration failed';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await api.login(email, password);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      setAuthToken(token);
      setCurrentUser(user);
      setLoggedIn(true);
      const { children: loaded } = await api.getChildren(token);
      setChildrenList(loaded as ChildProfile[]);

      const storedChildId = await AsyncStorage.getItem(CURRENT_CHILD_KEY);
      const validChild = loaded.find(c => c.id === storedChildId);
      if (validChild) {
        setCurrentChildIdState(validChild.id);
      } else if (loaded.length > 0) {
        setCurrentChildIdState(loaded[0].id);
        await AsyncStorage.setItem(CURRENT_CHILD_KEY, loaded[0].id);
      } else {
        setCurrentChildIdState(null);
      }

      return { success: true, hasChildren: loaded.length > 0 };
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Login failed');
      return { success: false, hasChildren: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
  console.log("Logout clicked");

  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, CURRENT_CHILD_KEY]);

  setAuthToken(null);
  setCurrentUser(null);
  setLoggedIn(false);
  setChildrenList([]);
  setCurrentChildIdState(null);
  setWeeklyProgress([]);
  setStreakStats(null);

  console.log("Logout finished");
};

  return (
    <AppContext.Provider
      value={{
        children: childrenList,
        currentChildId,
        setCurrentChildId,
        childProfile,
        addChild,
        updateChild,
        deleteChild,
        selectedAvatar,
        setSelectedAvatar,
        morningTasks,
        nightTasks,
        updateTask,
        addTask,
        editTask,
        deleteTask,
        currentUser,
        registerUser,
        loginUser,
        logout,
        isLoggedIn,
        isHydrated,
        isLoading,
        error,
        clearError,
        weeklyProgress,
        refreshWeeklyProgress,
        streakStats,
        refreshStreakStats,
        isOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
