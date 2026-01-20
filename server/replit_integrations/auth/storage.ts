// OIDC auth storage implementation
// Handles user data persistence for authentication

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export const authStorage = {
  async upsertUser(user: User): Promise<void> {
    // TODO: Implement when database is available
    console.log("User upserted:", user);
  },
};
