"use client";
import Brand from "@/components/LandingPage/Brand";
import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import Navbar from "@/components/LandingPage/Navbar";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

const page = () => {
  return (
    <div className={geist.className}>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
      <Brand />
    </div>
  );
};

export default page;
