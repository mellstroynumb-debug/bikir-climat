'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';

// Combined state for the Firebase context
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);


interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<{
    user: User | null;
    isUserLoading: boolean;
    userError: Error | null;
  }>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { 
      setUserAuthState({ user: null, isUserLoading: false, userError: null });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null });

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { 
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => { 
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); 
  }, [auth]); 

  const contextValue = useMemo((): FirebaseContextState => {
    return {
      firebaseApp,
      firestore,
      auth,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebaseContext = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      // During SSR, the context might not be available. We shouldn't throw.
      // The individual hooks (useFirestore, etc.) will handle the null context.
      if (typeof window !== 'undefined') {
        throw new Error('useFirebase must be used within a FirebaseProvider.');
      }
    }
    return context;
}


/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth | null => {
  const context = useFirebaseContext();
  return context?.auth ?? null;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore | null => {
  const context = useFirebaseContext();
  return context?.firestore ?? null;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp | null => {
  const context = useFirebaseContext();
  return context?.firebaseApp ?? null;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  const memoized = useMemo(factory, deps);
  
  if(memoized && typeof memoized === 'object') {
    (memoized as MemoFirebase<T>).__memo = true;
  }
  
  return memoized as T;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 */
export const useUser = () => {
  const context = useFirebaseContext();
  const defaultUserState = { user: null, isUserLoading: true, userError: null };
  if (!context) return defaultUserState;
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
};
