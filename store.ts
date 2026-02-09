
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, ViewType, Status, Priority, User } from './types';

interface AppState {
  tasks: Task[];
  view: ViewType;
  selectedTaskId: string | null;
  searchQuery: string;
  selectedTags: string[];
  isDarkMode: boolean;
  currentUser: User;
  
  // Actions
  setView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  toggleDarkMode: () => void;
  setSelectedTaskId: (id: string | null) => void;
  
  // Task Actions
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Status) => void;
  addComment: (taskId: string, content: string) => void;
}
// setCurrentUser: (currentUser) => set({ currentUser })
// setCurrentUser: (user: User) => void;

const MOCK_USER: User = {
  id: 'u1',
  name: 'Pratik Kamble',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  role: 'Product Lead'
};

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design system overhaul',
    description: 'Update the core palette to reflect the new brand guidelines.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    assigneeId: 'u1',
    tags: ['Design', 'Priority'],
    dependencies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    activities: [],
    attachments: []
  },
  {
    id: 't2',
    title: 'Finalize quarterly roadmap',
    description: 'Alignment meeting with engineering and product stakeholders.',
    status: 'Todo',
    priority: 'Urgent',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    assigneeId: 'u1',
    tags: ['Planning'],
    dependencies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    activities: [],
    attachments: []
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      view: ViewType.BOARD,
      selectedTaskId: null,
      searchQuery: '',
      selectedTags: [],
      isDarkMode: false,
      currentUser: MOCK_USER,

      setView: (view) => set({ view }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTags: (selectedTags) => set({ selectedTags }),
      toggleTag: (tag) => set((state) => ({
        selectedTags: Array.isArray(state.selectedTags) && state.selectedTags.includes(tag)
          ? state.selectedTags.filter(t => t !== tag)
          : [...(Array.isArray(state.selectedTags) ? state.selectedTags : []), tag]
      })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          title: taskData.title || 'Untitled Task',
          description: taskData.description || '',
          status: taskData.status || 'Todo',
          priority: taskData.priority || 'Medium',
          dueDate: taskData.dueDate || null,
          assigneeId: state.currentUser.id,
          tags: taskData.tags || [],
          dependencies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          activities: [],
          attachments: []
        };
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      moveTask: (id, newStatus) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)
      })),

      addComment: (taskId, content) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          comments: [...t.comments, {
            id: Math.random().toString(36).substr(2, 9),
            userId: state.currentUser.id,
            taskId,
            content,
            createdAt: new Date().toISOString()
          }]
        } : t)
      }))
    }),
    {
  name: 'lumina-storage-v4',
  version: 4
}

  )
);
