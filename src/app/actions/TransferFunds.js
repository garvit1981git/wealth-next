"use server";

import Mongoosedb from "@/lib/mongoose";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";
import { revalidatePath } from "next/cache";

export default async function TransferFunds({ userId, sourceAccountId, targetAccountId, amount }) {
  try {
    await Mongoosedb();
    const transferAmount = parseFloat(amount);

    if (!userId || !sourceAccountId || !targetAccountId || isNaN(transferAmount) || transferAmount <= 0) {
      return { success: false, error: "Invalid transfer parameters payload." };
    }

    // 1. Fetch and verify source account liquidity
    const sourceAccount = await Account.findById(sourceAccountId);
    if (!sourceAccount) return { success: false, error: "Source account not found." };

    const sourceBalance = parseFloat(sourceAccount.balance?.$numberDecimal || sourceAccount.balance || 0);
    if (sourceBalance < transferAmount) return { success: false, error: "Insufficient available balance." };

    // 2. Verify target account exists
    const targetAccount = await Account.findById(targetAccountId);
    if (!targetAccount) return { success: false, error: "Destination account not found." };

    // 3. Create the ledger records (Debit and Credit)
    const debitTx = await Transaction.create({
      accountId: sourceAccountId,
      user: userId,
      amount: transferAmount,
      type: "Expense",
      category: "transfer",
      description: `Internal transfer out to ${targetAccount.accountname}`,
      date: new Date(),
      status: "COMPLETED"
    });

    const creditTx = await Transaction.create({
      accountId: targetAccountId,
      user: userId,
      amount: transferAmount,
      type: "Income",
      category: "transfer",
      description: `Internal transfer in from ${sourceAccount.accountname}`,
      date: new Date(),
      status: "COMPLETED"
    });

    // 4. Update balance records atomically
    await Account.findByIdAndUpdate(sourceAccountId, {
      $inc: { balance: -transferAmount },
      $push: { Transaction: debitTx._id }
    });

    await Account.findByIdAndUpdate(targetAccountId, {
      $inc: { balance: transferAmount },
      $push: { Transaction: creditTx._id }
    });

    // 5. Append transaction references to user ledger
    await User.findByIdAndUpdate(userId, {
      $push: { Transaction: { $each: [debitTx._id, creditTx._id] } }
    });

    revalidatePath(`/dashboard`);
    return { success: true };
  } catch (error) {
    console.error("Transfer system transaction crash:", error);
    return { success: false, error: "Internal ledger processing crash." };
  }
}