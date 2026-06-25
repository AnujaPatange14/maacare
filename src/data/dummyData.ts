export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  type: 'boy' | 'girl' | 'neutral';
}

export interface Task {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  category: 'morning' | 'night';
}

export interface Routine {
  id: string;
  title: string;
  tasks: Task[];
}

export const avatars: Avatar[] = [
  { id: '1', name: 'Buddy', emoji: '👦', type: 'boy' },
  { id: '2', name: 'Princess', emoji: '👧', type: 'girl' },
  { id: '3', name: 'Star', emoji: '⭐', type: 'neutral' },
  { id: '4', name: 'Sunny', emoji: '☀️', type: 'neutral' },
  { id: '5', name: 'Rainbow', emoji: '🌈', type: 'neutral' },
  { id: '6', name: 'Moon', emoji: '🌙', type: 'neutral' },
];

export const morningTasks: Task[] = [
  { id: 'm1', title: 'Wake up early', icon: '☀️', completed: false, category: 'morning' },
  { id: 'm2', title: 'Brush teeth', icon: '🦷', completed: false, category: 'morning' },
  { id: 'm3', title: 'Wash face', icon: '💧', completed: false, category: 'morning' },
  { id: 'm4', title: 'Get dressed', icon: '👕', completed: false, category: 'morning' },
  { id: 'm5', title: 'Eat breakfast', icon: '🍳', completed: false, category: 'morning' },
  { id: 'm6', title: 'Pack school bag', icon: '🎒', completed: false, category: 'morning' },
];

export const nightTasks: Task[] = [
  { id: 'n1', title: 'Finish homework', icon: '📚', completed: false, category: 'night' },
  { id: 'n2', title: 'Put away toys', icon: '🧸', completed: false, category: 'night' },
  { id: 'n3', title: 'Take a bath', icon: '🛁', completed: false, category: 'night' },
  { id: 'n4', title: 'Brush teeth', icon: '🦷', completed: false, category: 'night' },
  { id: 'n5', title: 'Put on pajamas', icon: '😴', completed: false, category: 'night' },
  { id: 'n6', title: 'Read a story', icon: '📖', completed: false, category: 'night' },
];

export const affirmations = [
  'You are amazing! 🌟',
  'You can do anything! 💪',
  'You are loved! ❤️',
  'You are brave! 🦁',
  'You are kind! 🤗',
];
