"use server";

import Mongoosedb from "@/lib/mongoose";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction";
// import SavingsGoal from "../../../models/SavingsGoal";
import User from "../../../models/User";
import { revalidatePath } from "next/cache";
import { SavingsGoal } from "../../../models/SavingsGoal";

let AddingFund = async (data) => {
  try {
    await Mongoosedb();

    const { userId, goalId, accountId, amount } = data;

    // 1. Validation fallback guard
    if (!userId || !goalId || !accountId || !amount) {
      return {
        success: false,
        error: "Missing required fund allocation tracking properties.",
      };
    }

    const allocationAmount = parseFloat(amount);

    // CRITICAL SECURITY GUARD: Prevent zero or negative injections
    if (isNaN(allocationAmount) || allocationAmount <= 0) {
      return {
        success: false,
        error: "Monetary allocation must be a positive number.",
      };
    }

    // 2. Locate source account profile and evaluate balance liquidity limits
    const selectedAccount = await Account.findById(accountId);
    if (!selectedAccount) {
      return {
        success: false,
        error: "Source account profile not found.",
      };
    }

    const availableBalance = parseFloat(
      selectedAccount.balance?.$numberDecimal || selectedAccount.balance || 0,
    );

    if (availableBalance < allocationAmount) {
      return {
        success: false,
        error:
          "Insufficient account balance to fulfill this allocation request.",
      };
    }

    // 3. Locate target savings goal instance
    const selectedGoal = await SavingsGoal.findById(goalId);
    if (!selectedGoal) {
      return {
        success: false,
        error: "Target savings goal bucket not found.",
      };
    }
    let remaining = selectedGoal.targetAmount - selectedGoal.currentAmount;
    if (allocationAmount > remaining) {
      return {
        success: false,
        error: `allocation is very high the goal remaining only ${remaining}`,
      };
    }
    if (selectedGoal.targetAmount) {
    }
    // 4. Create historic transaction ledger entry copy
    let newTransaction = await Transaction.create({
      accountId,
      user: userId,
      amount: allocationAmount,
      type: "Expense",
      category: "savings",
      description: `Incremental funding deposit for goal: ${selectedGoal.name}`,
      date: new Date(),
      isRecurring: false,
      status: "COMPLETED",
    });

    // 5. ATOMIC OPERATION: Deduct cash pool and push transaction reference index mapping
    await Account.findByIdAndUpdate(accountId, {
      $inc: { balance: -allocationAmount },
      $push: { Transaction: newTransaction._id },
    });

    // 6. Push the transaction record into the parent User reference array
    await User.findByIdAndUpdate(userId, {
      $push: { Transaction: newTransaction._id },
    });

    // 7. Increment current amounts and monthly contributions inside the target goal model
    await SavingsGoal.findByIdAndUpdate(goalId, {
      $inc: {
        currentAmount: allocationAmount,
        thisMonthContribution: allocationAmount,
      },
    });

    // 8. Revalidate the Next.js router cache layer instantly for live dashboard synchronization
    revalidatePath(`/dashboard/${userId}`);

    return { success: true };
  } catch (error) {
    console.error("Critical error in AddingFund pipeline execution:", error);
    return { success: false, error: "Internal processing ledger crash." };
  }
};

export default AddingFund;
