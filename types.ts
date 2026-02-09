
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Comment {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  taskId: string;
  action: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  assigneeId: string;
  tags: string[];
  dependencies: string[]; // Task IDs
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  activities: Activity[];
  attachments: Attachment[];
}

export interface Workspace {
  id: string;
  name: string;
  tasks: Task[];
}

export enum ViewType {
  LIST = 'list',
  BOARD = 'board',
  CALENDAR = 'calendar',
  INSIGHTS = 'insights'
}
