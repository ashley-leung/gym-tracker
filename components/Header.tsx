'use client';
import React from 'react';
import { signInWithGoogle, signOut } from '../lib/firebase/auth';
import { getUser } from '../lib/firebase/getUser';

export default function Header() {
  const user = getUser();

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
            <p>{user.uid}</p>
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
