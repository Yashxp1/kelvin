import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-800">
      <h1>This is the landing page - to be done later!!!!!!!!</h1>{' '}
      <Button variant="link">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
};

export default page;
