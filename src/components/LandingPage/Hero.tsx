import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="min-h-screen bg-[#155DFC] text-white flex flex-col items-center justify-center gap-8 md:gap-12 px-4 md:px-6">
      <div className="text-center max-w-4xl space-y-4 pt-32 md:pt-[200px] pb-10">
        <h1 className="text-4xl md:text-6xl leading-tight">
          Build AI workflows on top <br className="hidden md:block" /> of the
          tools you already use
        </h1>
        <p className="text-white/90 text-base md:text-lg px-2 md:px-0">
          Create GitHub issues, pull requests, and Notion pages using simple
          prompts. <br className="hidden md:block" />
          Connect your existing GitHub and Notion accounts — no complex setup,
          no manual work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center w-full sm:w-auto">
          <a href="#features">
            <button
              className="
            w-full sm:w-auto
            px-6 py-3
            rounded-full
            border border-white/30
            text-white
            backdrop-blur-md
            bg-white/10
            hover:bg-white/20
            font-semibold
            transition
            "
            >
              Learn more
            </button>
          </a>

          <Link href="/register">
            <button
              className="
            w-full sm:w-auto
            px-6 py-3
            rounded-full
            font-semibold
            text-[#155DFC]
            bg-white
            backdrop-blur-md
            shadow-lg shadow-black/10
            hover:bg-white/90
            transition
            "
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full md:w-[85%] lg:w-[70%] mb-20 md:mb-32 max-w-5xl">
        <Image
          src="/hero.png"
          alt="Hero preview"
          width={1200}
          height={700}
          priority
          className="w-full h-auto border rounded-lg shadow-2xl shadow-black/10"
        />
      </div>
    </section>
  );
};

export default Hero;
