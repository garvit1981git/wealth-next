"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { CreditCard, CheckCircle, ChevronRight, Plus, ArrowRightLeft } from "lucide-react";
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
  const [todayRecurringTransactions, setTodayRecurringTransactions] = useState([]);

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
    <main className="min-h-screen bg-pureBg px-3 py-4 sm:px-6 lg:px-8 text-primaryText">
      <section className="max-w-7xl mx-auto">
        {account.Transaction.length === 0 ? (
          <div className="rounded-2xl bg-mainBg border border-cardBorder p-8 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-900 mb-4">
              <CreditCard className="w-6 h-6 text-primaryText" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Transactions Overview</h2>
            <p className="text-secondaryText text-sm">
              No activity recorded yet for this account.
            </p>
          </div>
        ) : (
          
          /* 
            UNIFIED BENTO GRID ENGINE
            - grid-cols-1 on mobile devices for stacked presentation layouts
            - grid-cols-3 on medium desktops and above for modular grid density
            - items-start stops containers from stretching out of sync
          */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-start">
            
            {/* ================= ROW 1 / BLOCK 1: Account Essentials (1 Col) ================= */}
            <div className="flex flex-col gap-3 md:col-span-1 w-full">
              
              {/* Card 1: Current Balance */}
              <div className="rounded-2xl bg-mainBg border border-cardBorder p-4 sm:p-5 shadow-sm flex flex-col justify-center min-h-[100px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondaryText">
                  Current Balance
                </p>
                {/* Responsive fluid text breaks prevent overflow scaling bugs on mobile layouts */}
                <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight font-mono text-primaryText truncate">
                  ₹{parseFloat(account.balance.$numberDecimal || account.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Card 2: Status Configuration */}
              <div className="rounded-2xl bg-mainBg border border-cardBorder p-4 shadow-sm flex flex-col justify-center min-h-[85px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondaryText">Account Status</span>
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

              {/* Action Link 1: Add Savings */}
              <Link href={`/dashboard/${accountId}/Amount`} className="block group">
                <div className="p-3.5 rounded-2xl shadow-sm flex justify-between items-center bg-mainBg border border-cardBorder hover:border-accentLight/40 transition duration-300">
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

              {/* Action Link 2: Internal Funds Transfer (Fixed user typo 'ransfer' -> 'Transfer') */}
              <Link href={`/dashboard/${accountId}/Amount/Transfer`} className="block group">
                <div className="p-3.5 rounded-2xl shadow-sm flex justify-between items-center bg-mainBg border border-cardBorder hover:border-accentLight/40 transition duration-300">
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

            {/* ================= ROW 1 / BLOCK 2: Category Analytics Distribution (1 Col) ================= */}
            <div className="md:col-span-1 w-[120%] bg-mainBg border border-cardBorder rounded-2xl p-4 shadow-sm min-h-[300px] mr-auto md:min-h-full flex flex-col justify-between">
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

            {/* ================= ROW 1 / BLOCK 3: Contextual Schedules & Summaries (1 Col) ================= */}
            <div className="flex flex-col gap-3 md:col-span-1 ml-auto w-[80%]">
              <div className="bg-mainBg border border-cardBorder rounded-2xl shadow-sm p-1 w-full">
                <DueTransactions
                  accountId={accountId}
                  dueExpense={dueExpense}
                  dueIncome={dueIncome}
                  todayRecurringTransactions={todayRecurringTransactions}
                />
              </div>
              <div className="bg-mainBg border border-cardBorder rounded-2xl shadow-sm p-1 w-full flex-1">
                <FinancialOverview
                  todaysIncome={todaysIncome}
                  todaysExpense={todaysExpense}
                />
              </div>
            </div>

            {/* ================= ROW 2 / BLOCK 4: Balance Horizon Line Graph (1 Col) ================= */}
            {/* Perfectly fills the initial column gap on row two */}
            <div className="md:col-span-1 w-full shadow-sm">
              <BalanceTrendChart accountId={accountId} />
            </div>

            {/* ================= ROW 2 / BLOCK 5: Transaction Ledger Listing Table (2 Cols) ================= */}
            {/* Matches the line chart height perfectly via max-height capping constraints */}
            <div className="md:col-span-2 w-full  overflow-y-auto rounded-2xl border border-cardBorder bg-mainBg shadow-sm scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent">
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
        )}
      </section>
    </main>
  );
};

export default AccountDisplayer;