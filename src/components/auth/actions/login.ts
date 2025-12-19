'use server';

import { signIn } from '@/lib/auth/auth';
import { AuthError } from 'next-auth';

type LoginProps = {
  email: string;
  password: string;
};

export const LoginAction = async (data: LoginProps) => {
  const { email, password } = data;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    throw error;
  }
};
