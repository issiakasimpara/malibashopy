import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function AuthButton() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (isAuthenticated) {
    return (
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          }
        }}
      />
    );
  }

  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Se connecter
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">
          S'inscrire
        </Button>
      </SignUpButton>
    </div>
  );
}
