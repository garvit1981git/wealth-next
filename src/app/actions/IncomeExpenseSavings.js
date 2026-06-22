"use server";

import Mongoosedb from "@/lib/mongoose";
import Transaction from "../../../models/Transaction"; // Adjust path if needed

export default async function GetMonthlyOverview(userId) {
  try {
    await Mongoosedb();

    // Get the current year to filter transactions
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear + 1}-01-01`);

    // Fetch all transactions for this year
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
      status: "COMPLETED"
    }).lean();

    // Initialize an empty skeleton for the 12 calendar months
    const monthSkeleton = [
      { month: "Jan", Income: 0, Expense: 0, Saving: 0 },
      { month: "Feb", Income: 0, Expense: 0, Saving: 0 },
      { month: "Mar", Income: 0, Expense: 0, Saving: 0 },
      { month: "Apr", Income: 0, Expense: 0, Saving: 0 },
      { month: "May", Income: 0, Expense: 0, Saving: 0 },
      { month: "Jun", Income: 0, Expense: 0, Saving: 0 },
      { month: "Jul", Income: 0, Expense: 0, Saving: 0 },
      { month: "Aug", Income: 0, Expense: 0, Saving: 0 },
      { month: "Sep", Income: 0, Expense: 0, Saving: 0 },
      { month: "Oct", Income: 0, Expense: 0, Saving: 0 },
      { month: "Nov", Income: 0, Expense: 0, Saving: 0 },
      { month: "Dec", Income: 0, Expense: 0, Saving: 0 },
    ];

    // Distribute transactions into their respective month buckets
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthIndex = txDate.getMonth(); // 0 for Jan, 1 for Feb, etc.
      const amount = parseFloat(tx.amount) || 0;

      if (tx.type === "Income") {
        monthSkeleton[monthIndex].Income += amount;
      } else if (tx.type === "Expense" && tx.category === "savings") {
        monthSkeleton[monthIndex].Saving += amount; // Capture goal allocations!
      } else if (tx.type === "Expense") {
        monthSkeleton[monthIndex].Expense += amount; // Standard spending
      }
    });

    // Optionally: Slice the array to only show the last 6 months up to the current month
    const currentMonthIndex = new Date().getMonth();
    const startIndex = Math.max(0, currentMonthIndex - 5);
    
    return monthSkeleton.slice(startIndex, currentMonthIndex + 1);

  } catch (error) {
    console.error("Failed to generate monthly chart aggregation:", error);
    return [];
  }
}