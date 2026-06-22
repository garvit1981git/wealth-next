"use server";

import Mongoosedb from "@/lib/mongoose";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction";

export default async function GetAccountBalanceTrend(accountId, days = 30) {
  try {
    await Mongoosedb();

    // 1. Fetch the account to get the true current balance
    const account = await Account.findById(accountId).lean();
    if (!account) return [];

    let currentBalance = parseFloat(
      account.balance?.$numberDecimal || account.balance || 0
    );

    // 2. Fetch only the transactions from the requested time window
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await Transaction.find({
      accountId,
      status: "COMPLETED",
      date: { $gte: startDate },
    })
      .sort({ date: -1 }) // Newest to oldest
      .lean();

    const trendData = [];
    let runningBalance = currentBalance;

    // 3. Loop backwards from today down to 30 days ago
    for (let i = 0; i < days; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dateString = targetDate.toISOString().split("T")[0]; // e.g. "2026-06-22"

      // Record the balance for the end of this day
      trendData.push({
        date: targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        balance: parseFloat(runningBalance.toFixed(2)),
      });

      // Filter transactions that happened on this exact day
      const dayTransactions = transactions.filter((tx) => {
        const txDateString = new Date(tx.date).toISOString().split("T")[0];
        return txDateString === dateString;
      });

      // Reverse math to calculate what the balance was YESTERDAY
      dayTransactions.forEach((tx) => {
        const amount = parseFloat(tx.amount || 0);
        if (tx.type === "Income") {
          runningBalance -= amount; // Subtract income to go back in time
        } else if (tx.type === "Expense") {
          runningBalance += amount; // Add back expenses to go back in time
        }
      });
    }

    // 4. Reverse the array so it flows chronologically (oldest -> newest) for the chart
    return trendData.reverse();
  } catch (error) {
    console.error("Failed to generate account balance trend:", error);
    return [];
  }
}