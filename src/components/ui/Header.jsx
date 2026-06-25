// "use server";

import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Home,
  Info,
  Wallet,
  Menu,
} from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { Sun, Moon } from "lucide-react";
// import gsap from "gsap";
import User from "./User";

import HeaderLink from "./HeaderLink";
import Image from "next/image";
import Sidebar from "./Sidebar";

function Navbar({ user }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-mainBg/20 backdrop-blur-xl border- border-slate-800 px-2 sm:px-6 py-4 min-h-[7%]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Navigation Links */}

        <div className="hidden md:flex justify-between md:gap-6 w-full items-center space-x-1">
          {/* Logo Section */}
          <Link href="/" className="flex  items-center gap-2 group ">
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
          <div className="flex gap-2 w-full ">
            <div className="flex gap-2 mx-auto">
              <Link
                href="/"
                className="flex items-center gap-1 px-3 py-2 rounded-xl  bg-accentLight hover:bg-accentDark transition-all "
              >
                <Home size={18} className="text-white" />
                <span className="text-sm text-white font-medium">Home</span>
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-1 px-3 py-2 rounded-xl  bg-accentLight hover:bg-accentDark transition-all"
              >
                <Info size={18} className="text-white" />
                <span className="text-sm text-white font-medium">About</span>
              </Link>
            </div>
            {!user ? (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href="/sign-in"
                  className="bg-accentLight hover:bg-accentDark text-white px-3 py-2 rounded-xl  text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-Up"
                  className="bg-accentLight hover:bg-accentDark text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 border-l border-slate-800 ml-4 pl-4">
                  <HeaderLink
                    url={"/dashboard"}
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                  />
                  <HeaderLink
                    url={"/transaction/create"}
                    icon={<PlusCircle size={20} />}
                    label="Add New"
                  />

                  <User user={user} />
                  <HeaderLink
                    url={"/sign-out"}
                    icon={<LogOut size={20} />}
                    label="Sign Out"
                  />
                </div>
              </>
            )}
          </div>
        </div>




        <div className="flex md:hidden justify-between md:gap-6 w-full items-center space-x-1">
          {!user ? (
            <>
              {" "}
              <Link href="/" className="flex  items-center gap-1 group ">
                {/* Icon */}
                <svg
                  className="w-8 h-8 transition-transform group-hover:scale-105"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Upward Trend Line */}
                  <path
                    d="M3 19L9 13L14 17L21 8"
                    className="stroke-accentLight" /* 👈 Uses your Tailwind class directly */
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Arrowhead */}
                  <path
                    d="M16 8H21V13"
                    className="stroke-accentLight" /* 👈 Uses your Tailwind class directly */
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Typography */}
                <span className="text-xl inline font-bold tracking-tight text-[var(--thePrimaryText)]">
                  Wealth<span className="text-[var(--accent-light)]">.</span>
                </span>
              </Link>
            </>
          ) : null}
          <div className="flex gap-2 w-full ">
            {!user ? (
              <div className="flex items-center gap-2 ml-auto">
                <Link
                  href="/sign-in"
                  className="bg-accentLight hover:bg-accentDark text-white px-3 py-2 rounded-xl  text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-Up"
                  className="bg-accentLight hover:bg-accentDark text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <>
              {/* <div className="flex justify-between items-center"> */}


                <Sidebar userCard={user ? <User user={user} /> : null} />

                
         
                
              </>
            )}
          </div>
          {/* Logo Section */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
