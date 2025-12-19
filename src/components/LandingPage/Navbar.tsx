import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

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

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed bg-[#155DFC] top-0 w-full z-50 transition-transform border-b border-blue-700 duration-300 ease-in-out backdrop-blur-md
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-2xl font-manrope font-semibold text-white tracking-tight">
              Kelvin.
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <button
                className="
       text-white
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
        bg-[#155DFC]
        text-white
        font-semibold
        rounded-md
        hover:bg-[#155DFC]/90
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
    </nav>
  );
};

export default Navbar;
