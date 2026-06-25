const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status);
  }

  return data as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiChild {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: { id: string; name: string; emoji: string; type: string } | null;
  photoUri?: string;
  morningTasks: import('../data/dummyData').Task[];
  nightTasks: import('../data/dummyData').Task[];
}

export interface WeeklyDay {
  date: string;
  label: string;
  progress: number;
  completed: number;
  total: number;
}

export interface StreakStats {
  currentStreak: number;
  perfectStreak: number;
  perfectDays: number;
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: (token: string) =>
    request<{ user: AuthUser }>('/api/auth/me', {}, token),

  getChildren: (token: string) =>
    request<{ children: ApiChild[] }>('/api/children', {}, token),

  createChild: (
    token: string,
    data: { name: string; age: number; gender: string; avatar: unknown; photoUri?: string }
  ) =>
    request<{ child: ApiChild }>('/api/children', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  updateChild: (token: string, id: string, data: Partial<ApiChild>) =>
    request<{ child: ApiChild }>(`/api/children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  deleteChild: (token: string, id: string) =>
    request<{ success: boolean }>(`/api/children/${id}`, { method: 'DELETE' }, token),

  createTask: (
    token: string,
    childId: string,
    data: { title: string; icon: string; category: 'morning' | 'night' }
  ) =>
    request<{ task: import('../data/dummyData').Task }>(`/api/tasks/${childId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  updateTask: (
    token: string,
    taskId: string,
    data: Partial<{ title: string; icon: string; completed: boolean; category: string }>
  ) =>
    request<{ task: import('../data/dummyData').Task }>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  toggleTask: (token: string, taskId: string) =>
    request<{ task: import('../data/dummyData').Task }>(`/api/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    }, token),

  deleteTask: (token: string, taskId: string) =>
    request<{ success: boolean }>(`/api/tasks/${taskId}`, { method: 'DELETE' }, token),

  getWeeklyProgress: (token: string, childId: string) =>
    request<{ days: WeeklyDay[] }>(`/api/progress/${childId}/weekly`, {}, token),

  getStreaks: (token: string, childId: string) =>
    request<{ streaks: StreakStats }>(`/api/progress/${childId}/streaks`, {}, token),
};

export { API_URL };
