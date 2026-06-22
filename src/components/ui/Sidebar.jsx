"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Info, LayoutDashboard, LogOut, Menu, PlusCircle, X } from 'lucide-react';

// Notice we accept `userCard` instead of `user` data now
const Sidebar = ({ userCard }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* 1. MOBILE HEADER ROW */}
      <div className="flex sm:hidden justify-between w-full items-center px-4 py-3 bg-mainBg/20 backdrop-blur-xl border-b border-slate-800/40 fixed top-0 left-0 right-0 z-30">
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-white/5 rounded-lg transition-all text-primaryText"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-lg font-bold tracking-tight text-primaryText">
            Wealth<span className="text-accentLight">.</span>
          </span>
        </Link>
      </div>

      {/* 2. BACKGROUND OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 sm:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* 3. SLIDE-IN SIDEBAR DRAWER */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-60 bg-mainBg border-r border-cardBorder/40 p-5 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out transform sm:hidden ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-xs font-black tracking-widest text-accentLight uppercase">
              FinPortfolio
            </span>
            <button onClick={closeSidebar} className="p-1 hover:bg-white/5 text-secondaryText rounded-md">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <Link href="/" onClick={closeSidebar} className="block group">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-accentLight/10 text-primaryText">
              <Home size={18} className="text-secondaryText group-hover:text-accentLight" />
              <span className="text-xs font-bold uppercase tracking-wider">Home</span>
            </div>
          </Link>

          <Link href="/about" onClick={closeSidebar} className="block group">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-accentLight/10 text-primaryText">
              <Info size={18} className="text-secondaryText group-hover:text-accentLight" />
              <span className="text-xs font-bold uppercase tracking-wider">About</span>
            </div>
          </Link>

          <Link href="/dashboard" onClick={closeSidebar} className="block group">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-accentLight/10 text-primaryText">
              <LayoutDashboard size={18} className="text-secondaryText group-hover:text-accentLight" />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </div>
          </Link>

          <Link href="/transaction/create" onClick={closeSidebar} className="block group">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-accentLight/10 text-primaryText">
              <PlusCircle size={18} className="text-secondaryText group-hover:text-accentLight" />
              <span className="text-xs font-bold uppercase tracking-wider">Add New</span>
            </div>
          </Link>
        </div>
 
        {/* Lower Segment */}
        <div className="flex flex-col gap-2 pt-4 border-t border-cardBorder/40">
          
          {/* SAFE: Server Component placeholder rendered seamlessly here */}
          <div className="px-1">
            {userCard}
          </div>

          <Link href="/sign-out" onClick={closeSidebar} className="block group">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-secondaryText">
              <LogOut size={18} className="text-secondaryText group-hover:text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-primaryText group-hover:text-rose-400">
                Sign Out
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;