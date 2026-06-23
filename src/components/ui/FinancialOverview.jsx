import React from "react";

const FinancialOverview = ({ todaysIncome, todaysExpense }) => {
  return (
    <div className="flex flex-col ">
      {/* Today's Income */}
      <div className="card capitalize text-green-500 p-5 rounded-xl text-xs border-collapse border border-cardBorder font-medium shadow-sm  ">
        <h1 className="text-xs font-semibold uppercase tracking-wider text-primaryText mb-1">
          Today's Income
        </h1>
        <h2 className="text-sm sm:text-xl font-mono font-bold text-green-500 tracking-tight">
          ₹{todaysIncome.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* Today's Expense */}
      <div className="card  capitalize text-red-500 p-5 rounded-xl text-xs border border-cardBorder  border-collapse font-medium shadow-sm  ">
        <h1 className="text-xs font-semibold uppercase tracking-wider text-primaryText mb-1">
          Today's Expense
        </h1>
        <h2 className="text-sm sm:text-xl font-mono font-bold text-red-500 tracking-tight">
          ₹{Math.abs(todaysExpense).toLocaleString("en-IN")}
        </h2>
      </div>
    </div>
  );
};

export default FinancialOverview;
