"use client";

import React from "react";
import * as Icons from "lucide-react";

const GoalCard = ({ goal }) => {
  if (!goal) return null;

  const { name, currentAmount, targetAmount, durationMonths, thisMonthContribution, lastMonthResetDate, startDate } = goal;

  // 1. Core Milestone Math Formulas
const monthlyTarget = Math.round(targetAmount / durationMonths);
const overallProgressPercent = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
const isGoalAchieved = currentAmount >= targetAmount;

// 2. Localized Dynamic Month Progression Math
const start = new Date(startDate);
const now = new Date();

const monthsElapsed = Math.max(
  0,
  (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
);
const monthsRemaining = Math.max(0, durationMonths - monthsElapsed);

// REMOVED Math.min capping here so it can scale up to 120%, 150%, etc.
const monthProgressPercent = monthlyTarget > 0 
  ? Math.round((thisMonthContribution / monthlyTarget) * 100) 
  : 0;

// Cap the visual bar fill at 100% so it doesn't break out of its container layout
const visualBarWidth = Math.min(monthProgressPercent, 100);
  // 3. Dynamic Contextual Icon Picker
  const getGoalIcon = (goalName) => {
    const lower = goalName.toLowerCase();
    if (lower.includes("bike") || lower.includes("motorcycle")) return <Icons.Bike size={18} />;
    if (lower.includes("car")) return <Icons.Car size={18} />;
    if (lower.includes("home") || lower.includes("house") || lower.includes("flat")) return <Icons.Home size={18} />;
    return <Icons.Target size={18} />;
  };

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5 h-full transition-all duration-300 bg-mainBg border-cardBorder ${
      isGoalAchieved ? "ring-1 ring-emerald-500/20 bg-emerald-500/[0.01]" : "hover:border-accentLight/40"
    }`}>
      
      {/* SECTION 1: Top Row Meta Headers */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isGoalAchieved 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-pureBg text-accentLight border border-cardBorder"
          }`}>
            {getGoalIcon(name)}
          </div>
          <div>
            <h3 className="text-sm font-bold capitalize text-primaryText tracking-tight">{name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Icons.Calendar size={12} className="text-secondaryText" />
              <span className="text-xs font-semibold text-secondaryText font-mono">
                {isGoalAchieved ? "Goal Completed" : `${monthsRemaining} Months Remaining`}
              </span>
            </div>
          </div>
        </div>

        {isGoalAchieved ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Icons.CheckCircle size={11} strokeWidth={2.5} /> Achieved
          </span>
        ) : (
          <span className="text-[11px] font-bold text-accentLight bg-accentLight/10 border border-accentLight/20 px-2.5 py-0.5 rounded-full font-mono">
            Target: ₹{targetAmount.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* SECTION 2: Split Progress Metrics Display Panel */}
      <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-pureBg/50 border border-cardBorder/40">
        {/* Metric A: This Month Contribution */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accentLight inline-block" /> This Month
          </span>
          <p className="text-md font-bold font-mono text-primaryText">
            ₹{thisMonthContribution.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] font-medium text-secondaryText block">
            Target: ₹{monthlyTarget.toLocaleString("en-IN")}/mo
          </span>
        </div>

        {/* Metric B: Total Pool Saved */}
        <div className="space-y-0.5 border-l border-cardBorder/60 pl-4">
          <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Total Saved
          </span>
          <p className="text-md font-bold font-mono text-primaryText">
            ₹{currentAmount.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] font-medium text-secondaryText block">
            Saved {overallProgressPercent}% overall
          </span>
        </div>
      </div>

      {/* SECTION 3: Micro Visual Bars Metrics Grid */}
      <div className="space-y-3.5 pt-1">
        {/* Track 1: Current Month Mini Bar */}
     {/* Track 1: Current Month Mini Bar */}
{!isGoalAchieved && (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] font-medium text-secondaryText">
      <span className="flex items-center gap-1">
        <Icons.Flame size={12} className={monthProgressPercent >= 100 ? "text-emerald-400" : "text-orange-400"} /> 
        Monthly Pace Target
      </span>
      {/* Displays raw calculated percentage value (e.g., 145%) */}
      <span className={`font-mono font-bold ${monthProgressPercent >= 100 ? "text-emerald-400" : "text-primaryText"}`}>
        {monthProgressPercent}%
      </span>
    </div>
    <div className="w-full h-1.5 bg-pureBg border border-cardBorder rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 rounded-full ${
          monthProgressPercent >= 100 
            ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
            : "bg-gradient-to-r from-orange-400 to-accentLight"
        }`}
        style={{ width: `${visualBarWidth}%` }} // Dynamic visual ceiling guard
      />
    </div>
  </div>
)}

        {/* Track 2: Macro Total Goal Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-secondaryText">
            <span className="flex items-center gap-1"><Icons.TrendingUp size={12} className="text-emerald-400 capitalize" />Progression of the overall goal</span>
            <span className="font-mono font-bold text-primaryText">{overallProgressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-pureBg border border-cardBorder rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalAchieved 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                  : "bg-gradient-to-r from-accentLight to-accentDark"
              }`}
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default GoalCard;