'use client';

import Link from 'next/link';

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <h1>This is the landing page - to be done later!!!!!!!!</h1>

      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
};

export default page; 
