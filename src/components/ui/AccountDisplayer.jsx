"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import {
  CreditCard,
  CheckCircle,
  ChevronRight,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import AccountWithTransactions from "@/app/actions/AccountWithTransactions";
import Transactionlist from "./Transactionlist";
import { TooltipProvider } from "./tooltip";
import Chart from "./chart";
import DueTransactions from "./DueTransactions";
import FinancialOverview from "./FinancialOverview";
import Link from "next/link";
import BalanceTrendChart from "./BalanceTrendChart";

const AccountDisplayer = ({ accountId }) => {
  const [account, setAccount] = useState(null);
  const [totalcountnext, setTotalCountNext] = useState(0);
  const [totalpage, setTotalPage] = useState(1);
  const [currentpage, setCurrentPage] = useState({
    startindex: 0,
    endindex: 5,
  });

  // Today's summary stats managed centrally
  const [todaysExpense, setTodaysExpense] = useState(0);
  const [todaysIncome, setTodaysIncome] = useState(0);
  const [todaysNet, setTodaysNet] = useState(0);

  // Due / Recurring stats managed centrally
  const [dueIncome, setDueIncome] = useState(0);
  const [dueExpense, setDueExpense] = useState(0);
  const [todayRecurringTransactions, setTodayRecurringTransactions] = useState(
    [],
  );

  // Fetch account data
  useEffect(() => {
    async function getAccWithTransacs() {
      const res = await AccountWithTransactions(accountId);
      if (!res?.account) {
        notFound();
      }
      setAccount(res.account);
    }
    getAccWithTransacs();
  }, [accountId]);

  // Calculate pagination total pages
  useEffect(() => {
    if (!account) return;
    const pages = Math.ceil(account.Transaction.length / 5);
    setTotalPage(pages);
  }, [account]);

  // Pagination Handlers
  const handlePagination = () => {
    setTotalCountNext((current) => current + 1);
    setCurrentPage((current) => ({
      startindex: current.startindex + 5,
      endindex: current.endindex + 5,
    }));
  };

  const handlePaginationBack = () => {
    setTotalCountNext((current) => current - 1);
    setCurrentPage((current) => ({
      startindex: current.startindex - 5,
      endindex: current.endindex - 5,
    }));
  };

  if (!account) return null;

  return (
    <main className="min-h-screen bg-pureBg p-4 sm:p-6 max-w-7xl mx-auto text-primaryText">
      <section className="w-full">
        {account.Transaction.length === 0 ? (
          <div className="rounded-2xl bg-mainBg border border-cardBorder p-8 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-900 mb-4">
              <CreditCard className="w-6 h-6 text-primaryText" />
            </div>
            <h2 className="text-lg font-semibold mb-1">
              Transactions Overview
            </h2>
            <p className="text-secondaryText text-sm">
              No activity recorded yet for this account.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4">
            {/* ================= ROW NUMBER 1 START ================= */}
            {/* Stacks vertically on mobile, layout flows to horizontal on desktop layouts (lg) */}
            <div className="row-1 flex flex-col lg:flex-row gap-4 w-full items-stretch">
              {/* BLOCK 1: Account Essentials (Takes 1 part desktop width) */}
              <div className="w-full lg:flex-1 flex flex-col gap-3">
                {/* Balance & Status Container: Side-by-side on tablet (sm), stacked on mobile/desktop */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full">
                  {/* Card 1: Current Balance */}
                  <div className="flex-1 rounded-2xl border border-cardBorder p-4 sm:p-5 shadow-sm flex flex-col justify-center min-h-[100px]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-secondaryText">
                      Current Balance
                    </p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight font-mono text-primaryText truncate">
                      ₹
                      {parseFloat(
                        account.balance.$numberDecimal || account.balance,
                      ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Card 2: Status Configuration */}
                  <div className="flex-1 rounded-2xl  border border-cardBorder p-4 sm:p-5 shadow-sm flex flex-col justify-center min-h-[100px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondaryText">
                        Account Status
                      </span>
                      {account.isDefault ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 uppercase">
                          <CheckCircle size={12} /> Default
                        </div>
                      ) : (
                        <div className="text-primaryText bg-neutral-800/40 px-2.5 py-0.5 rounded-lg border border-cardBorder text-[10px] font-bold uppercase">
                          Standard
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Links Container: Side-by-side on tablet (sm), stacked on mobile/desktop */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full">
                  {/* Action Link 1: Add Savings */}
                  <Link
                    href={`/dashboard/${accountId}/Amount`}
                    className="block group flex-1"
                  >
                    <div className="p-3.5 rounded-2xl shadow-sm flex justify-between items-center  border border-cardBorder hover:border-accentLight/40 transition duration-300">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-accentLight/10 text-accentLight border border-accentLight/15 rounded-xl">
                          <Plus size={13} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primaryText group-hover:text-accentLight transition-colors">
                          Add money to savings
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-secondaryText group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Action Link 2: Internal Funds Transfer */}
                  <Link
                    href={`/dashboard/${accountId}/Amount/Transfer`}
                    className="block group flex-1"
                  >
                    <div className="p-3.5 rounded-2xl shadow-sm flex justify-between items-center  border border-cardBorder hover:border-accentLight/40 transition duration-300">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/15 rounded-xl">
                          <ArrowRightLeft size={13} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primaryText group-hover:text-teal-400 transition-colors">
                          Transfer money
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-secondaryText group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* BLOCK 2: Category Analytics Distribution (Takes 2 parts desktop width) */}
              <div className="w-full lg:flex-[2_2_0%] rounded-2xlshadow-sm min-h-[320px] flex flex-col justify-between">
                <Chart
                  Transactions={account.Transaction}
                  accountId={accountId}
                  setTodaysExpense={setTodaysExpense}
                  setTodaysIncome={setTodaysIncome}
                  setTodaysNet={setTodaysNet}
                  setDueIncome={setDueIncome}
                  setDueExpense={setDueExpense}
                  setTodayRecurringTransactions={setTodayRecurringTransactions}
                />
              </div>

              {/* BLOCK 3: Contextual Schedules & Summaries (Takes 1 part desktop width) */}
              {/* Stacks vertically on mobile/desktop, splits side-by-side on tablet layouts (sm) */}
              <div className="w-full lg:flex-1 flex flex-col sm:flex-row lg:flex-col gap-3">
                <div className="flex-1 flex flex-col">
                  <DueTransactions
                    accountId={accountId}
                    dueExpense={dueExpense}
                    dueIncome={dueIncome}
                    todayRecurringTransactions={todayRecurringTransactions}
                  />
                </div>

                <div className="flex-1 :shadow-sm flex flex-col">
                  <FinancialOverview
                    todaysIncome={todaysIncome}
                    todaysExpense={todaysExpense}
                  />
                </div>
              </div>
            </div>
            {/* ================= ROW NUMBER 1 ENDING ================= */}

            {/* ================= STARTING OF ROW 2 ================= */}
            {/* Stacks vertically on mobile, switches to horizontal split on desktop layouts (lg) */}
            {/* ================= STARTING OF ROW 2 ================= */}
            {/* Stacks vertically on mobile/tablet, displays side-by-side with a uniform locked height on desktop (lg) */}
            <div className="row-2 flex flex-col lg:flex-row gap-4 w-full lg:h-[420px]">
              {/* BLOCK 4: Balance Horizon Line Graph */}
              {/* Restored missing panel background/borders and fixed the class string typo */}
              <div className="w-full lg:flex-1  rounded-2xl min-h-[300px] lg:min-h-0 flex flex-col">
                <BalanceTrendChart accountId={accountId} />
              </div>

              {/* BLOCK 5: Transaction Ledger Listing Table */}
              {/* Takes double width space. lg:h-full ensures it perfectly fills the 420px container and triggers the scrollbar */}
              <div className="w-full lg:flex-[2_2_0%] h-fit lg:h-full  min-h-[300px]   ">
                <TooltipProvider>
                  <Transactionlist
                    Transactions={account.Transaction}
                    currentpage={currentpage}
                    totalpage={totalpage}
                    handlepaginationback={handlePaginationBack}
                    handlepagination={handlePagination}
                    account={account}
                    totalcountnext={totalcountnext}
                  />
                </TooltipProvider>
              </div>
            </div>
            {/* ================= ENDING OF ROW 2 ================= */}
            {/* ================= ENDING OF ROW 2 ================= */}
          </div>
        )}
      </section>
    </main>
  );
};

export default AccountDisplayer;
