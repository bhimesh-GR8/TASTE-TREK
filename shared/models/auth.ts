// Simplified user type definitions used in the frontend.
// All backend database code has been removed since the project operates
// entirely on the client now.

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Upsert payload used when creating or updating a user.
export type UpsertUser = Partial<Omit<User, "id">>;
