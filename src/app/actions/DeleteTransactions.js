"use server";

import Mongoosedb from "@/lib/mongoose";
import Account from "../../../models/Account";
import User from "../../../models/User";
import Transaction from "../../../models/Transaction";
import mongoose from "mongoose"; // 1. Import mongoose for Decimal128 handling

let DeleteTransactions = async (selectedids, accountId, userid) => {
  await Mongoosedb();

  // Fetch the transactions before deleting them
  const transactionsToDelete = await Transaction.find({
    _id: { $in: selectedids },
  });

  if (!transactionsToDelete || transactionsToDelete.length === 0) {
    return { re: "No transactions found to delete" };
  }

  // Calculate the net balance adjustment using plain JS numbers first
  let balanceAdjustment = 0;

  transactionsToDelete.forEach((t) => {
    // Safely convert the Decimal128 transaction amount to a standard JS number
    const amount = Number(t.amount.toString()); 
    console.log(amount,typeof(amount));
    if (t.type === "Expense") {
      balanceAdjustment += amount;
    } else if (t.type === "Income") {
      balanceAdjustment -= amount;
    }
  });

  const user = await User.findById(userid);
  const account = await Account.findById(accountId);

  if (!user) throw new Error("User not found");
  if (!account) throw new Error("Account not found");

  // Delete the transactions from the collection
  await Transaction.deleteMany({
    _id: { $in: selectedids },
  });

  // Convert current account balance from Decimal128 to a standard number safely
  const currentBalance = Number(account.balance.toString());
  console.log("Current Balance:", currentBalance , typeof(currentBalance), "Balance Adjustment:", balanceAdjustment , typeof(balanceAdjustment));
  const newBalance = currentBalance + balanceAdjustment;

  // 2. Cast it BACK to a valid Mongoose Decimal128 string format before updating
  account.balance = mongoose.Types.Decimal128.fromString(newBalance.toFixed(2));

  console.log("New Computed Balance:", account.balance.toString());

  // Filter out the deleted IDs from relational reference arrays
  user.Transaction = user.Transaction.filter(
    (id) => !selectedids.includes(id.toString())
  );
  account.Transaction = account.Transaction.filter(
    (id) => !selectedids.includes(id.toString())
  );

  // Persist changes
  await user.save();
  await account.save();

  return { re: "success" };
};

export default DeleteTransactions;