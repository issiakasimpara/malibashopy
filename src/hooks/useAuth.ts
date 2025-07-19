import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl?: string;
  createdAt: Date;
}

export function useAuth() {
  const { isSignedIn, isLoaded, userId } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: clerkUser.fullName || undefined,
    imageUrl: clerkUser.imageUrl || undefined,
    createdAt: clerkUser.createdAt || new Date(),
  } : null;

  return {
    user,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    userId,
  };
}
