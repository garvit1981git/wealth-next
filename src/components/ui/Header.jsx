// "use server";

import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Home,
  Info,
  Wallet,
} from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { Sun, Moon } from "lucide-react";
// import gsap from "gsap";
import User from "./User";
import Logo from "../../images/Wealth.png";
import HeaderLink from "./HeaderLink";
import Image from "next/image";

function Navbar({ user }) {
  // const [theme, setTheme] = useState("light");
  // const containerRef = useRef(null);

  // const toggleTheme = () => {
  //   const nextTheme = theme === "light" ? "dark" : "light";
  //   setTheme(nextTheme);

  //   // Update cookies or localStorage here if you are persisting themes
  //   document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
  // };

  // useEffect(() => {
  //   const icon = containerRef.current?.querySelector(".theme-icon");
  //   if (!icon) return;

  //   // Trigger GSAP animation whenever theme changes
  //   gsap.fromTo(
  //     icon,
  //     { rotate: -90, scale: 0.5, opacity: 0 },
  //     { rotate: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
  //   );

  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [theme]);
  return (
    <nav className="fixed  top-0 w-full z-50 bg-mainBg/20 backdrop-blur-xl border- border-slate-800  px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group mr-4">
          {/* Icon */}
          <svg
            className="w-10 h-10 transition-transform group-hover:scale-105"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Upward Trend Line */}
            <path
              d="M3 19L9 13L14 17L21 8"
              stroke="url(#logo-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Straight, Perfectly Aligned Arrowhead */}
            <path
              d="M16 8H21V13"
              stroke="url(#logo-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient using your CSS theme variables */}
            <defs>
              <linearGradient
                id="logo-grad"
                x1="3"
                y1="19"
                x2="21"
                y2="8"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--accent-light)" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          {/* Typography */}
          <span className="text-xl hidden sm:inline font-bold tracking-tight text-[var(--thePrimaryText)]">
            Wealth<span className="text-[var(--accent-light)]">.</span>
          </span>
        </Link>
        {/* Navigation Links */}

        <div className="hidden sm:flex md:gap-6 items-center space-x-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-accentLight hover:bg-accentDark transition-all"
          >
            <Home size={22} className="text-primaryText" />
            <span className="">Home</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-accentLight hover:bg-accentDark transition-all"
          >
            <Info size={22} className="text-primaryText" />
            <span>About</span>
          </Link>

          {!user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link
                href="/sign-in"
                className="bg-accentLight hover:bg-accentDark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/sign-Up"
                className="bg-accentLight hover:bg-accentDark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-slate-800 ml-4 pl-4">
              <HeaderLink
                url={"/dashboard"}
                icon={<LayoutDashboard size={22} />}
                label="Dashboard"
              />
              <HeaderLink
                url={"/transaction/create"}
                icon={<PlusCircle size={22} />}
                label="Add New"
              />

              <User user={user} />
              <HeaderLink
                url={"/sign-out"}
                icon={<LogOut size={22} />}
                label="Sign Out"
              />
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center space-x-1">
          <HeaderLink
            url={"/"}
            icon={<Home size={22} className="text-primaryText" />}
            label="Home"
          />
          <HeaderLink
            url={"/about"}
            icon={<Info size={22} className="text-primaryText" />}
            label="About"
          />

          {!user ? (
            <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-4">
              {/* Secondary Ghost Button */}
              <Link
                href="/sign-in"
                className="text-sm font-medium text-thePrimaryText px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>

              {/* Primary Solid Action Button */}
              <Link
                href="/sign-up"
                className="text-sm font-medium bg-accentLight text-white px-3.5 py-2 rounded-lg hover:bg-accentDark shadow-sm hover:shadow-purple-500/20 transition-all whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-slate-800 ml-4 pl-4">
              <HeaderLink
                url={"/dashboard"}
                icon={<LayoutDashboard size={22} />}
                label="Dashboard"
              />
              <HeaderLink
                url={"/transaction/create"}
                icon={<PlusCircle size={22} />}
                label="Add New"
              />
              <User user={user} />
              <HeaderLink
                url={"/sign-out"}
                icon={<LogOut size={22} />}
                label="Sign Out"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
