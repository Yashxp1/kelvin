import { ModeToggle } from '@/components/dark-mode/ModeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = () => {
  return (
    <div>
      <ModeToggle></ModeToggle>
      
      Landing page

      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
};

export default page;
