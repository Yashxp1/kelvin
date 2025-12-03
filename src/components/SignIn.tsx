'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';

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
    <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
      Sign in with Google
    </Button>
  );
}
