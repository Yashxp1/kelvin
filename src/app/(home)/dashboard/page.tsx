import { ModeToggle } from '@/components/dark-mode/ModeToggle';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

const Page = () => {
  return (
    <div className="px-4 py-6 md:py-8">
      <h1 className="text-center text-xl md:text-3xl py-4 font-semibold">
        Manage Your Workspaces
      </h1>

      <div className="flex  flex-col w-full text-xs gap-2 font-semibold justify-center items-center mt-4">
        <div className="p-2 rounded-sm bg-zinc-800 w-fit">
          <BriefcaseBusiness className="size-8 md:size-10" />
        </div>
        <p className="text-zinc-300">Add a workspace image</p>
      </div>

      <div className="flex flex-col justify-center items-center mt-6">
        <div className="w-full max-w-sm  flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <Label>Workspace name</Label>
            <Input placeholder="Kelvin" />
          </div>
          <Button className="w-full flex justify-center items-center">
            Create <ArrowRight size={14} className="" />
          </Button>
        </div>
        <div>
          <ModeToggle />
        </div>

        <Logo></Logo>
      </div>
    </div>
  );
};

export default Page;
