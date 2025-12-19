import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const feat = [
  {
    title: 'Connect Github',
    description:
      'AI-powered PR summaries, automated PR & issue creation, and streamlined file updates directly within your repo.',
  },
  {
    title: 'Connect Notion',
    description:
      'Get instant, intelligent summaries of your Notion pages and effortlessly create new content using AI.',
  },
  {
    title: 'Powered by Gemini AI',
    description:
      'Every interaction is enhanced with advanced logic and natural language capabilities, all driven by the Gemini API.',
  },
];

const Features = () => {
  return (
    <div
      id="features"
      className="w-full px-4 md:px-8 py-10 flex justify-center"
    >
      <div className="w-full max-w-7xl border border-zinc-300 bg-white">
        <div>
          <div className="flex justify-center py-10 md:py-16">
            <h2 className="bg-[#155DFC] text-white text-sm md:text-base px-3 py-1 rounded-full">
              Features
            </h2>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 py-12 md:py-20 border-t border-b border-zinc-200 px-4">
            <h1 className="text-3xl md:text-5xl text-center  leading-tight text-black">
              Elevate your workflow with <br className="hidden md:block" />{' '}
              AI-powered automation
            </h1>
            <p className="text-center text-base md:text-lg text-black/60 max-w-2xl mx-auto">
              Your app comes with production-ready actions for GitHub and Notion
              — designed to remove repetitive work and let you ship faster with
              fewer manual steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-zinc-200">
            {feat.map((feature, index) => (
              <div
                key={index}
                className="p-6 md:p-8 hover:bg-[#155DFC] hover:text-white transition duration-300 group"
              >
                <h2 className="text-xl md:text-2xl mb-3">{feature.title}</h2>
                <p className="text-black/70 group-hover:text-white/90 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-zinc-200">
          <div className="px-4 py-12 md:py-20">
            <h1 className="text-2xl md:text-4xl text-center max-w-3xl mx-auto leading-tight">
              Track and review all AI-generated actions across GitHub and
              Notion.
            </h1>
          </div>
          <div className="w-full">
            <Image
              src="/history.png"
              alt="Dashboard preview"
              width={1200}
              height={700}
              className="w-full h-auto border-t border-zinc-200"
            />
          </div>
        </div>

        <div className="flex py-20 md:py-32 justify-center items-center bg-[#155DFC] text-white flex-col px-4">
          <div className="flex flex-col gap-4 max-w-2xl text-center">
            <h1 className="text-3xl md:text-5xl">Start using Kelvin today</h1>
            <p className="text-base md:text-lg opacity-90">
              Connect GitHub and Notion, automate repetitive tasks,{' '}
              <br className="hidden md:block" /> and let AI handle the busy
              work.
            </p>
          </div>

          <Link href="/register">
            <button className="mt-8 md:mt-10 px-8 py-3 rounded-full text-[#155DFC] bg-white hover:bg-gray-100 transition shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
