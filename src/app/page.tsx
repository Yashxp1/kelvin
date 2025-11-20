import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

const page = () => {
  return (
    <div>
     
      Landing page
      <Link href="/dashboard">
        <Button>
          Dashboard <Home />
        </Button>
      </Link>
    </div>
  );
};

export default page;
