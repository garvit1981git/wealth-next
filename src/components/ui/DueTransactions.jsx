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
    <div className="flex flex-col rounded-xl ">
      {/* Left Card: Due Expenses Link */}
      <Link href={`/account/${accountId}/ins`} className="block">
        <div className="cursor-pointer  p-5 rounded-2xl border  border-cardBorder transition-all shadow-sm flex justify-between items-center  group">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-primaryText">
              Today's Due Expenses ({NumberOfDueExpense})
            </span>
            <h2 className="text-sm sm:text-xl font-mono font-bold text-red-500 tracking-tight">
              {dueExpense > 0 ? `₹${dueExpense.toFixed(2)}` : `₹0.00`}
            </h2>
          </div>
          <div className="p-2 rounded-lg group-hover:bg-mainBg  transition-colors group-hover:scale-120">
            <ChevronRight className="w-5 h-5 text-primaryText  transition-colors" />
          </div>
        </div>
      </Link>

      {/* Right Card: Due Income Reminders */}
      <Link href={`/account/${accountId}/ins`} className="block ">
        <div className="group cursor-pointer border border-cardBorder group rounded-2xl p-5  transition-all shadow-sm flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-primaryText">
              Today's Due Income ({NumberOfDueIncome})
            </span>
            <h2 className="text-sm sm:text-xl font-mono font-bold text-green-500 tracking-tight">
              {dueIncome > 0 ? `+ ₹${dueIncome.toFixed(2)}` : `₹0.00`}
            </h2>
          </div>
          <div className="p-2 rounded-lg group-hover:bg-mainBg group-hover:scale-120 transition-colors">
            <ChevronRight className="w-5 h-5 text-primaryText  transition-colors" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DueTransactions;
