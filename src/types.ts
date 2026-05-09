export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    viewed: boolean;
  };
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  code: string;
}

export interface AppState {
  user: User | null;
  remotePeerId: string | null;
  messages: Message[];
  isConnected: boolean;
}
