import { useEffect, useState, useMemo } from "react";
import FinancialOverview from "./FinancialOverview";
import IncomeExpenseChart from "./IncomeExpenseChart";
import DueTransactions from "./DueTransactions";

const Chart = ({ Transactions, accountId,setTodaysExpense,setTodaysIncome,setTodaysNet ,setDueIncome,setDueExpense,setTodayRecurringTransactions}) => {
  const [range, setRange] = useState("1M");


  // 1. Sort and Filter Transactions by Range
  const filteredTransactions = useMemo(() => {
    const sorted = [...Transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const now = new Date();

    return sorted.filter((t) => {
      const tDate = new Date(t.date);
      const diffTime = now - tDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (range === "1W") return diffDays <= 7;
      if (range === "1M") return diffDays <= 30;
      if (range === "3M") return diffDays <= 90;
      if (range === "6M") return diffDays <= 180;
      if (range === "1YR") return diffDays <= 365;
      return true; // "ALL"
    });
  }, [Transactions, range]);

  // 2. Format Data for the Recharts Bar Chart
  const chartData = useMemo(() => {
    const grouped = {};
    filteredTransactions.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      if (!grouped[key]) {
        grouped[key] = { name: key, income: 0, expense: 0 };
      }

      if (t.type === "Income") grouped[key].income += t.amount;
      if (t.type === "Expense") grouped[key].expense += t.amount;
    });
    return Object.values(grouped);
  }, [filteredTransactions]);

  // 3. Process Daily & Recurring calculations safely
  useEffect(() => {
    const today = new Date();

    let localTodaysExpense = 0;
    let localTodaysIncome = 0;
    let localDueExpense = 0;
    let localDueIncome = 0;

    // Filter today's transactions
    Transactions.forEach((t) => {
      const targetDate = new Date(t.date);
      const isMatch =
        today.getFullYear() === targetDate.getFullYear() &&
        today.getMonth() === targetDate.getMonth() &&
        today.getDate() === targetDate.getDate();

      if (isMatch) {
        if (t.type === "Expense") {
          localTodaysExpense -= t.amount;
        } else {
          localTodaysIncome += t.amount;
        }
      }
    });

    // Filter today's recurring transactions
    const tRecurring = Transactions.filter((t) => {
      if (!t.nextRecurringDate) return false;
      const recurringDate = new Date(t.nextRecurringDate);
      return (
        today.getFullYear() === recurringDate.getFullYear() &&
        today.getMonth() === recurringDate.getMonth() &&
        today.getDate() === recurringDate.getDate()
      );
    });

    tRecurring.forEach((t) => {
      if (t.type === "Expense") {
        localDueExpense += t.amount; // kept as positive number for presentation logic below
      } else {
        localDueIncome += t.amount;
      }
    });

    // Update States cleanly
    setTodaysExpense(localTodaysExpense);
    setTodaysIncome(localTodaysIncome);
    setTodaysNet(localTodaysIncome + localTodaysExpense);

    setTodayRecurringTransactions(tRecurring);
    setDueExpense(localDueExpense);
    setDueIncome(localDueIncome);
  }, [Transactions]);

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto ">
        {/* Top Section: Today's Income & Expenses Cards */}
        <IncomeExpenseChart
          data={chartData}
          range={range}
          onRangeChange={setRange}
        />

        {/* Bottom Section: Due / Next Recurring Reminders */}

        {/* Middle Section: Chart Component */}
      </div>
     
    </>
  );
};

export default Chart;
