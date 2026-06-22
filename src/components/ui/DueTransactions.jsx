import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const DueTransactions = ({
  accountId,
  dueExpense,
  dueIncome,
  todayRecurringTransactions,
}) => {
  let [NumberOfDueExpense, setNumberOfDueExpense] = useState(0);
  let [NumberOfDueIncome, setNumberOfDueIncome] = useState(0);
  useEffect(() => {
    todayRecurringTransactions.forEach((t) => {
      if (t.type == "Income") {
        NumberOfDueIncome += 1;
      } else {
        NumberOfDueExpense += 1;
      }
      setNumberOfDueIncome(NumberOfDueIncome);
      setNumberOfDueExpense(NumberOfDueExpense);
    });
  }, [todayRecurringTransactions]);
  return (
    <div className="flex flex-col rounded-2xl bg-mainBg">
      {/* Left Card: Due Expenses Link */}
      <Link href={`/account/${accountId}/ins`} className="block group">
        <div className="cursor-pointer  p-5 rounded-2xl hover:border-neutral-700/80 transition-all hover:scale-103 shadow-sm flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-primaryText">
              Today's Due Expenses ({NumberOfDueExpense})
            </span>
            <h2 className="text-2xl font-mono font-bold text-red-500 tracking-tight">
              {dueExpense > 0 ? `₹${dueExpense.toFixed(2)}` : `₹0.00`}
            </h2>
          </div>
          <div className="p-2 rounded-lg bg-mainBg group-hover:bg-mainBg-700 transition-colors">
            <ChevronRight className="w-5 h-5 text-primaryText group-hover:scale-102 transition-colors" />
          </div>
        </div>
      </Link>

      {/* Right Card: Due Income Reminders */}
      <Link href={`/account/${accountId}/ins`} className="block group">
        <div className="group cursor-pointer  hover:scale-103 rounded-2xl p-5  transition-all shadow-sm flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-primaryText">
              Today's Due Income ({NumberOfDueIncome})
            </span>
            <h2 className="text-2xl font-mono font-bold text-green-500 tracking-tight">
              {dueIncome > 0 ? `+ ₹${dueIncome.toFixed(2)}` : `₹0.00`}
            </h2>
          </div>
          <div className="p-2 rounded-lg group-hover:scale-102 transition-colors">
            <ChevronRight className="w-5 h-5 text-primaryText  transition-colors" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DueTransactions;
