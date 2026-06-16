"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Wallet,
  Receipt,
  Calendar,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Sun,
  Moon,
} from "lucide-react";
import gsap from "gsap";
import Toggletheme from "@/app/actions/Toogletheme";

const Usercard = ({ user, dbtheme }) => {
  const [theme, setTheme] = useState(dbtheme);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme Syncing & GSAP Animations
  useEffect(() => {
    if (!mounted) return;
    const icon = containerRef.current?.querySelector(".theme-icon");
    if (!icon) return;

    gsap.fromTo(
      icon,
      { rotate: -90, scale: 0.5, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
    );

    // FIXED: Changed from dbtheme to theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  // Handle Body Scroll Locking on Modal Open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    }; // Cleanup
  }, [open]);

  if (!mounted || !user?.user) return null;
  const u = user.user;

  // Format Overall Global Budget
  const totalBudget = parseFloat(u.budget?.Amount?.$numberDecimal || 0).toFixed(
    2,
  );
  const totalTransactions = u.Transaction?.length || 0;

  const toggleTheme = async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    let res = await Toggletheme(u._id, nextTheme);
    console.log("Theme toggled:", res);
  };

  return (
    <>
      {/* Trigger: Stylish Finance Avatar */}
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-xl bg-accentLight font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-110 active:scale-95"
      >
        {u.name.charAt(0).toUpperCase()}
        {/* <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></span> */}
      </button>

      {/* Modal via Portal */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Modal Content Wrapper */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-300">
              {/* Header/Banner Area */}
              <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-indigo-950 dark:to-violet-950 flex justify-end items-start p-6">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/20 dark:bg-black/20 p-2 text-white/90 backdrop-blur-md hover:bg-white/30 dark:hover:bg-black/40 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-6">
                {/* Profile Offset Row */}
                <div className="relative -mt-10 flex items-center justify-between mb-6">
                  <div className="flex items-end gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white dark:border-slate-900 bg-indigo-600 text-2xl font-bold text-white shadow-md">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="pb-1">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                        {u.name}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        <Mail size={12} className="text-indigo-500" /> {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Theme Toggle Button placement */}
                  <button
                    ref={containerRef}
                    onClick={toggleTheme}
                    className="p-4 relative right-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex items-center justify-center overflow-hidden w-10 h-10"
                    aria-label="Toggle Theme"
                  >
                    <div className="theme-icon flex items-center justify-center">
                      {theme === "light" ? (
                        <Sun
                          size={20}
                          className="text-amber-500 fill-amber-100"
                        />
                      ) : (
                        <Moon
                          size={20}
                          className="text-blue-400 fill-blue-950"
                        />
                      )}
                    </div>
                  </button>
                </div>

                {/* Primary Financial Overview Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="text-xs font-medium">Global Budget</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      ₹ {totalBudget}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                      <Receipt size={16} className="text-blue-500" />
                      <span className="text-xs font-medium">Activity</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {totalTransactions} Transactions
                    </p>
                  </div>
                </div>

                {/* Segment: Connected Accounts Breakdowns */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    Connected Financial Accounts
                  </h4>

                  {u.accounts && u.accounts.length > 0 ? (
                    u.accounts.map((acc, i) => (
                      <div
                        key={acc._id || i}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/30 p-3.5 border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 text-indigo-500 dark:text-indigo-400">
                            <CreditCard size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="block font-semibold text-sm text-slate-700 dark:text-slate-200">
                                {acc.name || "Main Checking"}
                              </span>
                              {acc.isDefault && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                  Default
                                </span>
                              )}
                            </div>
                            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              Type: {acc.type || "Bank"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">
                              ₹{" "}
                              {parseFloat(
                                u.budget?.Amount?.$numberDecimal || 0,
                              ).toFixed(2)}
                            </span>
                            <span className="block text-[10px] font-medium text-emerald-500 text-right">
                              Monthly Budget
                            </span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm text-slate-400">
                      <Wallet size={24} className="mx-auto mb-1.5 opacity-40" />
                      No linked accounts found.
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <Calendar size={12} />
                  <span>
                    Secured Profile — System Member Since{" "}
                    {mounted && u.createdAt
                      ? new Date(u.createdAt).getFullYear()
                      : "2026"}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Usercard;
