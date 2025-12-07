'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { FaGoogle } from 'react-icons/fa';

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
    <Button
      className="w-full py-3 text-xs"
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
    >
      <FaGoogle /> Login with Google
    </Button>
  );
}
