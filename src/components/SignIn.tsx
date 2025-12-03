// components/SignInButton.tsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function SignInButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button onClick={() => signOut({ callbackUrl: '/' })}>
        Sign out ({session.user?.email})
      </button>
    );
  }
  return (
    <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
      Sign in with Google
    </button>
  );
}
