'use client';

import SignInButton from '@/components/SignIn';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';
import React from 'react';

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <h1>This is the landing page - to be done later!!!!!!!!</h1>

      {/* <Button onClick={() => signIn('google')}>Sign In with Google</Button> */}
      <SignInButton />
    </div>
  );
};

export default page;
