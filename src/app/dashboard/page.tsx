import { BriefcaseBusiness } from 'lucide-react';

const Page = () => {
  return (
    <div>
      <h1 className="text-center text-2xl py-2">Manage Your Workspace</h1>
      <div className='flex flex-col w-full text-xs font-semibold'>
        <div className="p-2 rounded-sm bg-blue-900 w-fit">
          <BriefcaseBusiness className="size-10" />
        </div>
        <p>Add a workspace image</p>
      </div>
    </div>
  );
};

export default Page;
