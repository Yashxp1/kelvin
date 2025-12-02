import { Button } from '@/components/ui/button';
import { SiGithub, SiLinear, SiNotion } from 'react-icons/si';

const page = () => {
  const items = [
    {
      title: 'Github',
      url: '#',
      icon: SiGithub,
    },
    {
      title: 'Notion',
      url: '#',
      icon: SiNotion,
    },
    {
      title: 'Linear',
      url: '#',
      icon: SiLinear,
    },
  ];

  return (
    <div>
      <h1 className="font-semibold text-2xl p-6">Integrations</h1>
      <div className="flex gap-3 justify-center px-4 items-center ">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="border rounded-md  w-50 flex flex-col justify-center items-center p-6 dark:bg-zinc-900/80 bg-zinc-100/30"
          >
            <div className="flex justify-center items-center">
              <i.icon size={40} />
            </div>
            <div className="flex w-full flex-col pt-6 gap-2 justify-center items-center">
              <h2 className="">{i.title}</h2>
              <Button className="w-full">Connect</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
