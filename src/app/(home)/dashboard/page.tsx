import { ModeToggle } from '@/components/darkmode/ModeToggle';
import { Button } from '@/components/ui/button';

const page = () => {
  return (
    <div className="flex justify-center h-screen gap-5 items-center">
      <ModeToggle></ModeToggle>
      <Button variant="default">Test</Button>
      <Button variant="outline">Test</Button>
      <Button variant="secondary">Test</Button>
    </div>
  );
};

export default page;
