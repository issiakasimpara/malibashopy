import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('🚨 VITE_CLERK_PUBLISHABLE_KEY is required');
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorText: '#0f172a',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg border border-gray-200',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
