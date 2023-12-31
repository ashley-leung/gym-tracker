'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from '@/lib/firebase/auth';

function useUserSession(initialUser: User | null) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return user;
}

interface Props {
  initialUser: User | null;
}

export default function Header({ initialUser }: Props) {
  const user = useUserSession(initialUser);

  const handleSignOut = (event: React.MouseEvent) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: React.MouseEvent) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      {user ? (
        <>
          <div className='profile'>
            <p>{user.displayName}</p>
            <p>{user.email}</p>
            <a href='#' onClick={handleSignOut}>
              Sign Out
            </a>
          </div>
        </>
      ) : (
        <a href='#' onClick={handleSignIn}>
          Sign In with Google
        </a>
      )}
    </header>
  );
}
