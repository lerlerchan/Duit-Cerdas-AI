type UserProfile = {
  dob: string;
  bazi_element: string;
  risk_level: string;
  growthTokens: number;
  createdAt: string;
};

const users = new Map<string, UserProfile>();

export const memoryStore = {
  getUser: (userId: string) => users.get(userId),
  setUser: (userId: string, profile: UserProfile) => {
    users.set(userId, profile);
  },
  incrementTokens: (userId: string) => {
    const user = users.get(userId);
    if (!user) return null;
    const updated = { ...user, growthTokens: user.growthTokens + 1 };
    users.set(userId, updated);
    return updated.growthTokens;
  }
};
