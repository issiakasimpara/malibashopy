import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('🚨 VITE_CLERK_PUBLISHABLE_KEY is required');
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const { theme } = useTheme();

  return (
    <BaseClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: theme === 'dark' ? '#0f172a' : '#ffffff',
          colorText: theme === 'dark' ? '#f1f5f9' : '#0f172a',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg border border-gray-200 dark:border-gray-800',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
