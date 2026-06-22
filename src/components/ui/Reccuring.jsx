"use client"
import React, { useMemo } from 'react';
import Link from 'next/link';
import * as Icons from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { defaultCategories } from "../../../data/categary";
import CreateTransaction from '@/app/actions/CreateTransaction';

const categoryMap = Object.fromEntries(defaultCategories.map((c) => [c.id, c]));

const Reccuring = ({ todayreccuring = [], onCreateTransaction }) => {
  // 1. Separate transactions into Income and Expense buckets cleanly
  const dueIncomeList = useMemo(() => todayreccuring.filter(t => t.type === "Income"), [todayreccuring]);
  const dueExpenseList = useMemo(() => todayreccuring.filter(t => t.type === "Expense"), [todayreccuring]);

  // Reusable Component for Rendering Table Subsections safely
  const TransactionTable = ({ list, fallbackText }) => {
    if (list.length === 0) {
      return (
        <div className="text-center p-8 bg-neutral-900/20 border border-neutral-800/60 rounded-xl text-neutral-400 text-sm">
          {fallbackText}
        </div>
      );
    }
let onCreateTransaction = async  (t)=>{
  console.log(t)
 let data =  {
    type: t.type,
    amount: t.amount,
    description: t.description,
    date: t.date,
    accountId: t.accountId,
    user: t.user,
    category: t.category,
    isRecurring: false,
  };
let res = await CreateTransaction(data,null,t)
}
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-mainBg">
        <table className="w-full min-w-[750px] text-sm text-left">
          <thead className="border-b border-neutral-800 bg-neutral-900/40 text-primaryText font-semibold">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Interval</th>
              <th className="p-4 w-44 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-primaryText">
            {list.map((t) => {
              const category = categoryMap[t.category];
              const CustomIcon = Icons[category?.icon] || Icons.MoreHorizontal;

              return (
                <tr key={t._id} className="hover:bg-neutral-900/20 transition-colors group">
                  <td className="p-4 text-neutral-400 font-medium whitespace-nowrap align-middle">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 capitalize font-medium max-w-[180px] truncate align-middle">
                    {t.description || "—"}
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                      style={{
                        backgroundColor: `${category?.color}12`,
                        color: category?.color,
                        border: `1px solid ${category?.color}25`,
                      }}
                    >
                      <CustomIcon size={12} />
                      {category?.name || t.category}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold font-mono tracking-tight text-base align-middle whitespace-nowrap ${
                    t.type === "Income" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center align-middle whitespace-nowrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 cursor-pointer transition-colors hover:bg-purple-500/20">
                          {t.recurringInterval || "Recurring"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-neutral-900 border border-neutral-800 text-primaryText p-2 rounded-lg text-xs shadow-xl">
                        <p className="font-medium">
                          Next Due:{" "}
                          <span className="text-neutral-400">
                            {t.nextRecurringDate ? new Date(t.nextRecurringDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }) : "—"}
                          </span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="p-4 text-right align-middle whitespace-nowrap">
                    <button
                      onClick={() => onCreateTransaction(t)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-white transition-all shadow-sm"
                    >
                      <Icons.CheckCircle size={13} className="text-neutral-400" />
                      <span>Process Due</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-mainBg border border-neutral-800 rounded-2xl shadow-sm max-w-7xl mx-auto">
      
      {/* Top Header & Actions Section */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Daily Schedule Processing</h1>
          <p className="text-sm text-neutral-400 mt-1">Review active automated standing instructions scheduled for execution today.</p>
        </div>
        <Link href="/transaction/create">
          <button className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors shadow-sm whitespace-nowrap">
            <Icons.Plus size={16} strokeWidth={2.5} />
            <span>Add Transaction</span>
          </button>
        </Link>
      </div> */}

      {/* Section A: Today's Scheduled Due Income */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-500">
          <Icons.ArrowDownLeft size={18} />
          <h2 className="text-md font-bold uppercase tracking-wider text-neutral-300">Today's Due Income</h2>
        </div>
        <TransactionTable 
          list={dueIncomeList} 
          fallbackText="No scheduled or due income operations listed for today." 
        />
      </div>

      {/* Section B: Today's Scheduled Due Expenses */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-rose-500">
          <Icons.ArrowUpRight size={18} />
          <h2 className="text-md font-bold uppercase tracking-wider text-neutral-300">Today's Due Expenses</h2>
        </div>
        <TransactionTable 
          list={dueExpenseList} 
          fallbackText="No scheduled or outstanding due expenses identified for today." 
        />
      </div>

    </div>
  );
};

export default Reccuring;