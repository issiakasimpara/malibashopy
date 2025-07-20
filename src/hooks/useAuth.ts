import { useUser, useAuth as useClerkAuth, useSignUp, useSignIn, useClerk } from '@clerk/clerk-react';

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
  const { isSignedIn, isLoaded, userId, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn: clerkSignIn, isLoaded: signInLoaded } = useSignIn();
  const clerk = useClerk();

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: clerkUser.fullName || undefined,
    imageUrl: clerkUser.imageUrl || undefined,
    createdAt: clerkUser.createdAt || new Date(),
  } : null;

  // Fonction d'inscription avec gestion de la vérification email
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('📝 Inscription Clerk avec:', email, firstName, lastName);

      if (!clerkSignUp || !signUpLoaded) {
        return { error: { message: 'Service d\'inscription non disponible' } };
      }

      // Créer le compte SANS firstName/lastName car ils ne sont pas supportés
      const result = await clerkSignUp.create({
        emailAddress: email,
        password,
      });

      console.log('📊 Statut inscription:', result.status);
      console.log('📋 Champs requis:', result.requiredFields);
      console.log('📋 Champs manquants:', result.missingFields);
      console.log('📋 Champs non vérifiés:', result.unverifiedFields);

      // TOUJOURS préparer la vérification email car Clerk l'exige
      if (result.status === 'missing_requirements') {
        console.log('📧 Préparation vérification email...');

        try {
          // Préparer la vérification email dans tous les cas
          await result.prepareEmailAddressVerification({ strategy: 'email_code' });
          console.log('📧 Code de vérification envoyé !');

          return {
            error: null,
            needsVerification: true,
            signUpId: result.id
          };
        } catch (emailError) {
          console.error('❌ Erreur envoi email:', emailError);

          // Si l'email est déjà vérifié, continuer
          if (emailError.message?.includes('already verified') ||
              emailError.message?.includes('déjà vérifié')) {
            console.log('✅ Email déjà vérifié !');
            return { error: null };
          }

          return { error: { message: 'Impossible d\'envoyer le code de vérification' } };
        }
      }

      // Si inscription complète directement (rare avec vérification email)
      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        console.log('✅ Inscription réussie !');
        return { error: null };
      }

      return { error: { message: 'Statut d\'inscription inattendu: ' + result.status } };
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error);

      // Gestion des erreurs spécifiques
      if (error.errors?.[0]?.code === 'form_identifier_exists') {
        return { error: { message: 'Un compte existe déjà avec cette adresse email' } };
      }

      const errorMessage = error.errors?.[0]?.message || error.message || 'Erreur d\'inscription';
      return { error: { message: errorMessage } };
    }
  };

  // Fonction de vérification du code email
  const verifyEmailCode = async (code: string) => {
    try {
      console.log('📧 Vérification du code:', code);

      if (!clerkSignUp) {
        return { error: { message: 'Service de vérification non disponible' } };
      }

      const result = await clerkSignUp.attemptEmailAddressVerification({ code });

      console.log('📊 Statut vérification:', result.status);

      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        console.log('✅ Vérification réussie !');
        return { error: null };
      }

      return { error: { message: 'Vérification incomplète' } };
    } catch (error: any) {
      console.error('❌ Erreur vérification:', error);
      const errorMessage = error.errors?.[0]?.message || error.message || 'Code de vérification invalide';
      return { error: { message: errorMessage } };
    }
  };

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Connexion avec:', email);

      // Vérifier si déjà connecté
      if (isSignedIn) {
        console.log('✅ Utilisateur déjà connecté !');
        return { error: null };
      }

      if (!clerkSignIn || !signInLoaded) {
        return { error: { message: 'Service de connexion non disponible' } };
      }

      const result = await clerkSignIn.create({
        identifier: email,
        password,
      });

      console.log('📊 Statut connexion:', result.status);

      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        console.log('✅ Connexion réussie !');
        return { error: null };
      }

      return { error: { message: 'Connexion incomplète' } };
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error);

      // Gestion spéciale pour "déjà connecté"
      if (error.message?.includes('already signed in') ||
          error.message?.includes('Session already exists')) {
        console.log('✅ Utilisateur déjà connecté (via erreur) !');
        return { error: null };
      }

      const errorMessage = error.errors?.[0]?.message || error.message || 'Erreur de connexion';
      return { error: { message: errorMessage } };
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      await clerkSignOut();
      console.log('✅ Déconnexion réussie !');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur déconnexion:', error);
      return { error: { message: 'Erreur de déconnexion' } };
    }
  };

  return {
    user,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    userId,
    signUp,
    signIn,
    signOut,
    verifyEmailCode,
  };
}
