"use server"

import Mongoosedb from "@/lib/mongoose";
import { redirect } from "next/navigation"
import User from "../../../models/User";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction";

let CreateTransaction = async (data, editId) => {
  await Mongoosedb();

  const account = await Account.findById(data.accountId);
  if (!account) throw new Error("Account not found");

  // --- 1. HANDLE BALANCE LOGIC ---
  if (editId) {
    // REVERSE the old transaction impact before applying new values
    const oldTransaction = await Transaction.findById(editId);
    if (oldTransaction) {
      const reverseAmount = oldTransaction.type === "Income" 
        ? -Number(oldTransaction.amount) 
        : Number(oldTransaction.amount);
      
      account.balance = Number(account.balance) + reverseAmount;
    }
  }

  // APPLY the new transaction impact
  if (data.type === "Income") {
    account.balance = Number(account.balance) + Number(data.amount);
  } else {
    account.balance = Number(account.balance) - Number(data.amount);
  }
  await account.save();

  // --- 2. CALCULATE RECURRING ---
  const calculateNextRecurringDate = (date, interval) => {
    const d = new Date(date);
    if (interval === "DAILY") d.setDate(d.getDate() + 1);
    else if (interval === "WEEKLY") d.setDate(d.getDate() + 7);
    else if (interval === "MONTHLY") d.setMonth(d.getMonth() + 1);
    else if (interval === "YEARLY") d.setFullYear(d.getFullYear() + 1);
    else return null;
    return d;
  };

  let nextdate = data.isRecurring ? calculateNextRecurringDate(data.date, data.recurringInterval) : null;

  // --- 3. SAVE OR UPDATE TRANSACTION ---
  const transactionData = {
    type: data.type,
    amount: data.amount,
    description: data.description,
    date: data.date,
    accountId: data.accountId,
    user: data.user,
    category: data.category,
    isRecurring: data.isRecurring,
    recurringInterval: data.isRecurring ? data.recurringInterval : undefined,
    nextRecurringDate: nextdate
  };

  if (editId) {
    // UPDATE EXISTING
    await Transaction.findByIdAndUpdate(editId, transactionData);
  } else {
    // CREATE NEW
    const newTransaction = await Transaction.create(transactionData);
    
    // Add to User and Account arrays
    await User.findByIdAndUpdate(data.user, { $push: { Transaction: newTransaction._id } });
    await Account.findByIdAndUpdate(data.accountId, { $push: { Transaction: newTransaction._id } });
  }

  redirect(`/account/${data.accountId}`);
}

export default CreateTransaction;