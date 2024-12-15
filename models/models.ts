export interface Topic {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  user_id: number;
  topic_id: number;
  content: string;
  timestamp: string;
  rating: number;
  likes: number[];
}

export interface Login {
  username: string;
  password: string;
}

export interface Register {
  username: string;
  password: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  friends: number[];
  location: string;
  age: number;
  rating: number;
  activity: string;
}

export interface UserUpdate{
  name: string;
  location: string;
  age: number;
}

export interface Chat {
  chat_id: number;
  messages: Message[];
  receiver_id: number;
  sender_id: number;
}

export interface Chats {
  id: number;
  receiver_id: number;
  sender_id: number;
  my_id: number;
}

export interface Message {
  id: number;
  receiver_id: number;
  sender_id: number;
  content: string;
  timestamp: string;
  chat_id: number;
}

export interface AddFriendRequest {
  friend_id: number;
}

export interface IsFollowedResponse {
  is_friend: boolean;
}

export interface Activity {
  count: number;
  date: string;
}

export interface UserActivity {
  Activity: Activity[];
}
