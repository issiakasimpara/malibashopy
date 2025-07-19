import { useAuth } from '@/hooks/useAuth';
import { SignIn } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <SignIn 
            routing="hash"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
