"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlurIn } from "../ui/blur-in";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed bg-[#F0EDED] top-0 w-full z-50 transition-transform duration-300 ease-in-out backdrop-blur-md
      ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <BlurIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-manrope font-semibold text-[#564F4B] tracking-tight">
                Kelvin.
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <button
                  className="
       text-[#564F4B]
        font-semibold
        px-5 py-2.5
        rounded-md    
        transition-colors
        duration-200
      "
                >
                  Log in
                </button>
              </Link>

              <Link href="/register">
                <button
                  className="
        bg-[#F0EDED]
        text-[#564F4B]
        font-semibold
        rounded-md
        hover:bg-[#F0EDED]/90
        transition-colors
        duration-200
      "
                >
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </BlurIn>
    </nav>
  );
};

export default Navbar;
