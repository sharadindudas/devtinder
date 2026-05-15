export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isOnboarded: boolean;
  bio: string;
  avatar: string;
  github?: string;
  experienceLevel: string;
  skills: string[];
  interests: string[];
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
}

export type AuthStatus = "PENDING" | "AUTHENTICATED" | "UNAUTHENTICATED";

export interface AuthContextData {
  user: User | null;
  authStatus: AuthStatus;
  ensureData: () => Promise<User | null>;
}