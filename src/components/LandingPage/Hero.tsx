import Link from "next/link";
import Image from "next/image";
import { BlurIn } from "../ui/blur-in";

const Hero = () => {
  return (
    <section className="min-h-screen bg-[#F0EDED] text-[#564F4B] flex flex-col items-center justify-center gap-8 md:gap-12 px-4 md:px-6">
      <div className="text-center max-w-4xl space-y-4 pt-32 md:pt-[200px] pb-10">
        <BlurIn className="text-4xl md:text-6xl leading-tight">
          <h1>
            Build AI workflows on top <br className="hidden md:block" /> of the
            tools you already use
          </h1>
        </BlurIn>
        <BlurIn className="text-[#564F4B]/90 text-base md:text-lg px-2 md:px-0">
          <p>
            Create GitHub issues, pull requests, and Notion pages using simple
            prompts. <br className="hidden md:block" />
            Connect your existing GitHub and Notion accounts — no complex setup,
            no manual work.
          </p>
        </BlurIn>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center w-full sm:w-auto">
          <a href="#features">
            <BlurIn>
              <button
                className="
            w-full sm:w-auto
            px-6 py-3
            rounded-md
            border border-[#564F4B]/30
            text-[#564F4B]
            backdrop-blur-md
            bg-white
            hover:bg-[#F0EDED]/20
            font-semibold
            transition
            "
              >
                Learn more
              </button>
            </BlurIn>
          </a>

          <Link href="/register">
            <BlurIn>
              <button
                className="
            w-full sm:w-auto
            px-6 py-3
            rounded-md
            font-semibold
            text-white
            bg-[#564F4B]
            backdrop-blur-md
            hover:bg-[#564F4B]/90
            transition
            "
              >
                Get Started
              </button>
            </BlurIn>
          </Link>
        </div>
      </div>

      <div className="w-full md:w-[85%] lg:w-[70%] mb-20 md:mb-32 max-w-5xl">
        <BlurIn>
          <Image
            src="/hero.png"
            alt="Hero preview"
            width={1200}
            height={700}
            priority
            className="w-full h-auto border rounded-lg shadow-2xl shadow-black/10"
          />
        </BlurIn>
      </div>
    </section>
  );
};

export default Hero;
