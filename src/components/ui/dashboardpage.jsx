"use client";
import React, { useEffect, useState } from "react";
import CreateAccountDrawer from "@/components/ui/CreateDrawer";
import { ChevronRight, Plus } from "lucide-react";
import AccountCardList from "./accountcard";

import BudgetProgress from "./BudgetProgress";
import PieChart from "./PieChart";
import DefAccountRecList from "./DefAccountRecList";

import Link from "next/link";
import GoalList from "./GoalList";
import BudgetChart from "./BudgetChart";
import { toast, Toaster } from "sonner";

let Dashboardpage = ({ user, budget, goals ,completedGoalNames}) => {
  const [acc, setacc] = useState("");
  const hasTransactions = user?.Transaction?.length > 0;
useEffect(() => {
    if (completedGoalNames && completedGoalNames.length > 0) {
      completedGoalNames.forEach((goalName) => {
        toast.success(`🎉 Milestone Reached! Your savings goal "${goalName}" is fully achieved!`, {
          duration: 5000,
        });
      });
    }
  }, [completedGoalNames]);
  return (
    <div className="p-4 sm:p-5 max-w-7xl mx-auto">
      
      {/* GRID FIXES: 
        1. 'gap-4' tightens the space between cards.
        2. 'items-start' is the MAGIC class. It tells the grid NOT to stretch cards vertically.
           Cards will now only be exactly as tall as their inside content.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        
        {/* Box 1: Accounts Registry */}
        <div className="bg-mainBg border border-cardBorder rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-primaryText">My Accounts</h2>
            <CreateAccountDrawer>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-accentLight bg-accentLight/10 border border-accentLight/20 px-2.5 py-1 rounded-lg hover:bg-accentLight/20 transition cursor-pointer">
                <Plus size={12} /> Add
              </div>
            </CreateAccountDrawer>
          </div>
          {/* Changed from h-[300px] to max-h-[220px] so it shrinks if there are only 1-2 accounts */}
          <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent">
            <AccountCardList />
          </div>
        </div>

        {/* Box 2: Analytical Pie Chart */}
        {hasTransactions && (
          <div className="bg-mainBg border border-cardBorder rounded-2xl gap-5 p-4 flex flex-col shadow-sm">
            <div className="mb-1">
              <h2 className="text-sm font-bold text-primaryText">Expense Analytics</h2>
              <p className="text-[11px] text-secondaryText">Asset classification matrix</p>
            </div>
            {/* Forced a compact height constraint on the chart wrapper */}
            <div className="max-h-[420px] flex items-center justify-center">
              <PieChart userid={user._id} setacc={setacc} acc={acc} />
            </div>
          </div>
        )}

        {/* Box 3: Savings Accumulation Bucket Tracks */}
        <div className="bg-mainBg border border-cardBorder rounded-2xl p-4 flex flex-col gap-3 shadow-sm lg:col-span-1">
          <Link href={`/dashboard/${user._id}`} className="block group">
            <div className="flex items-center justify-between p-3 bg-pureBg border border-cardBorder/60 rounded-xl transition duration-300 group-hover:border-accentLight/40">
              <div>
                <h3 className="text-xs font-bold text-primaryText capitalize tracking-tight group-hover:text-accentLight transition-colors">
                  Create Savings Goal
                </h3>
                <p className="text-[10px] text-secondaryText mt-0.5">Set target horizons</p>
              </div>
              <div className="p-1.5 rounded-lg border border-cardBorder bg-mainBg group-hover:bg-accentLight/10 transition-colors">
                <ChevronRight size={14} className="text-secondaryText group-hover:text-accentLight transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          {/* Compact max-height list for existing goals */}
          <div className="max-h-[420px] min-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent">
            <GoalList goals={goals} />
          </div>
        </div>

    
        {/* Box 5: Live Budget Chart */}
        {hasTransactions && (
          <div className="bg-mainBg border border-cardBorder rounded-2xl p-4 shadow-sm  lg:col-span-1 ">
            <BudgetChart userId={user._id} />
          </div>
        )}
            {/* Box 4: Recent Account Transactions Ledger */}
        {hasTransactions && (
          <div className="bg-mainBg border border-cardBorder rounded-2xl p-4 shadow-sm md:col-span-2 lg:col-span-2 flex flex-col gap-3">
            <div>
              <h2 className="text-sm font-bold text-primaryText">Recent Transactions</h2>
              <p className="text-[11px] text-secondaryText mt-0.5">Realtime monitoring ledger</p>
            </div>
            {/* Tightened max height so it fits beautifully next to the budget chart */}
            <div className="col-span-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cardBorder flex-1  scrollbar-track-transparent max-h-[330px]">
              <DefAccountRecList userid={user._id} setacc={setacc} acc={acc} />
            </div>
          </div>
        )}

      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Dashboardpage;