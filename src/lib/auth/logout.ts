'use server';

import { signOut } from '@/lib/auth/auth';

export const LogoutAction = async () => {
  await signOut({ redirectTo: '/' });
};
