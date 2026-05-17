export interface FeedUser {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  github?: string;
  experienceLevel: string;
  skills: string[];
  interests: string[];
  isOnboarded: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  skillScore: number;
  interestScore: number;
}

export interface FeedResponse {
  feed: FeedUser;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

