'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../../ui/button';
import { FaGoogle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function GoogleAuth() {
  const { data: session } = useSession();
  const path = usePathname();

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
      <FaGoogle />{' '}
      {path === '/login' ? 'Login with Google' : 'Get started with Google'}
    </Button>
  );
}
