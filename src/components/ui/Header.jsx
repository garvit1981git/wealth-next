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
    <nav className="fixed top-0 w-full z-50 bg-mainBg/20 backdrop-blur-xl border- border-slate-800  px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="capitalize text-2xl text-accentDark font-bold">
            my website
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-accentLight hover:bg-accentDark transition-all"
          >
            <Home size={18} className="text-primaryText" />
            <span>Home</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-accentLight hover:bg-accentDark transition-all"
          >
            <Info size={18} className="text-primaryText" />
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
              <Link
                href="/dashboard"
                className="p-2  hover:bg-accentDark rounded-lg transition-all"
                title="Dashboard"
              >
                <LayoutDashboard size={20} />
              </Link>
              <Link
                href="/transaction/create"
                className="p-2  hover:bg-accentDark rounded-lg transition-all"
                title="Add New"
              >
                <PlusCircle size={20} />
              </Link>
              <User user={user} />
          
              <Link
                href="/sign-out"
                className="p-2  hover:bg-accentDark rounded-lg transition-all"
              >
                <LogOut size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
