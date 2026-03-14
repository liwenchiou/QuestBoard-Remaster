export interface GuildTask {
  id: number;
  day: string;
  title: string;
  theme: string;
  link: string;
  available: boolean;
}

export interface CheckIn {
  id: string;
  name: string;
  avatar: string;
  task: string;
  url: string;
  report: string;
  created_at: string;
}

export interface Message {
  id: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
  type: 'system' | 'user';
}

export type AppMode = 'home' | 'bulletin' | 'library' | 'tavern' | 'admin';
