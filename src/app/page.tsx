'use client';
import Brand from '@/components/LandingPage/Brand';
import Features from '@/components/LandingPage/Features';
import Footer from '@/components/LandingPage/Footer';
import Hero from '@/components/LandingPage/Hero';
import Navbar from '@/components/LandingPage/Navbar';
import { Instrument_Sans } from 'next/font/google';

const instrumentSans = Instrument_Sans({ subsets: ['latin'] });

const page = () => {
  return (
    <div className={instrumentSans.className}>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
      <Brand />
    </div>
  );
};

export default page;
