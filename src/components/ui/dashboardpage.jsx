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

let Dashboardpage = ({ user, budget, goals, completedGoalNames }) => {
  const [acc, setacc] = useState("");
  const hasTransactions = user?.Transaction?.length > 0;
  useEffect(() => {
    if (completedGoalNames && completedGoalNames.length > 0) {
      completedGoalNames.forEach((goalName) => {
        toast.success(
          `🎉 Milestone Reached! Your savings goal "${goalName}" is fully achieved!`,
          {
            duration: 5000,
          },
        );
      });
    }
  }, [completedGoalNames]);
  const hasGoals = goals && goals.length > 0;
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col w-full gap-4">
        {/* ROW NUMBER 1 START */}
        {/* Stacks vertically on mobile/tablet, converts to horizontal row on desktop (lg) */}
        <div className="row-1 flex flex-col lg:flex-row gap-4 lg:h-[460px]">
          {/* Box 1: Accounts Registry */}
          <div className="  border border-cardBorder rounded-2xl p-4 flex flex-1 flex-col gap-3 shadow-sm">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-primaryText">
                My Accounts
              </h2>
              <CreateAccountDrawer>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-accentLight bg-accentLight/10 border border-accentLight/20 px-2.5 py-1 rounded-lg hover:bg-accentLight/20 transition cursor-pointer">
                  <Plus size={12} /> Add
                </div>
              </CreateAccountDrawer>
            </div>

            {/* Accounts List Container */}
            {/* Note: Assumes <AccountCardList /> renders individual card items as immediate children */}
            <div
              className="overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent 
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 
    max-h-[220px] sm:max-h-[280px] lg:max-h-none lg:flex-1"
            >
              <AccountCardList />
            </div>
          </div>

          {/* Responsive Wrapper for Box 2 and Box 3 */}
          {/* Mobile: Vertical Stack | Tablet (sm): Side-by-Side Row | Desktop (lg): Takes up 2/3 of the main row space */}
          <div className="flex flex-col sm:flex-row lg:flex-[2_2_0%] gap-4 w-full">
            {/* Box 2: Analytical Pie Chart */}
            {hasTransactions && (
              <div className="bg-mainBg border border-cardBorder rounded-2xl p-4 flex flex-col flex-1 shadow-sm justify-between">
                <div className="mb-2">
                  <h2 className="text-xs sm:text-sm md:text-sm font-bold text-primaryText">
                    Expense Analytics
                  </h2>
                
                </div>
                <div className="flex items-center justify-center flex-1 py-4">
                  <PieChart userid={user._id} setacc={setacc} acc={acc} />
                </div>
              </div>
            )}

            {/* Box 3: Savings Accumulation Bucket Tracks */}
            {/* flex-1 ensures it expands to fill half the width on tablet, or 100% width if Box 2 is hidden */}
            <div
              className={`bg-mainBg border border-cardBorder rounded-2xl p-4 flex flex-col shadow-sm transition-all duration-300 ${
                hasGoals ? "flex-1 gap-3" : "flex-1 h-fit "
              }`}
            >
              {/* Action Link: Create Savings Goal */}
              <Link href={`/dashboard/${user._id}`} className="block group w-full">
                <div className="flex items-center justify-between p-3 bg-pureBg border border-cardBorder/60 rounded-xl transition duration-300 group-hover:border-accentLight/40">
                  <div>
                    <h3 className="text-xs font-bold text-primaryText capitalize tracking-tight group-hover:text-accentLight transition-colors">
                      Create Savings Goal
                    </h3>
                    <p className="text-[10px] text-secondaryText mt-0.5">
                      Set target horizons
                    </p>
                  </div>
                  <div className="p-1.5 rounded-lg border border-cardBorder bg-mainBg group-hover:bg-accentLight/10 transition-colors">
                    <ChevronRight
                      size={14}
                      className="text-secondaryText group-hover:text-accentLight transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>

              {/* Conditionally Render Goal List Wrapper */}
              {hasGoals && (
                <div className="max-h-[300px] lg:max-h-none lg:flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent">
                  <GoalList goals={goals} />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ROW NUMBER 1 ENDING */}

        {/* STARTING OF ROW 2 */}
        {/* Stacks vertically on mobile, switches to horizontal row on medium screens (md) */}
        <div className="row-2 flex flex-col md:flex-row gap-4 md:h-[400px]">
          {/* Box 5: Live Budget Chart */}
          {hasTransactions && (
            <div className=" flex-1 min-h-[300px] md:min-h-0">
              <BudgetChart userId={user._id} />
            </div>
          )}

          {/* Box 4: Recent Account Transactions Ledger */}
          {hasTransactions && (
            <div className="w-full md:flex-[2_2_0%] overflow-hidden">
              <DefAccountRecList userid={user._id} setacc={setacc} acc={acc} />
            </div>
          )}
        </div>
        {/* ENDING OF ROW 2 */}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Dashboardpage;
