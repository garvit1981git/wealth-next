"use server";

import Mongoosedb from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction";
import { SavingsGoal } from "../../../models/SavingsGoal";
import User from "../../../models/User";

export default async function CreateSavingsGoal(formData) {
  try {
    await Mongoosedb();

    const {
      userId,
      name,
      targetAmount,
      durationMonths,
      currentAmount, // initialFunding from the client
      thisMonthContribution,
      accountId,
    } = formData;

    // 1. Validation fallback guards
    if (!userId || !name || !targetAmount || !durationMonths || !accountId) {
      return {
        success: false,
        error: "Missing required form tracking specifications.",
      };
    }

    // Force absolute value and parse parameters safely
    const parsedTargetAmount = parseFloat(targetAmount);
    const parsedDurationMonths = parseInt(durationMonths, 10);
    const fundingDeposit = parseFloat(currentAmount) || 0;

    // CRITICAL SECURITY GUARD: Stop negative values from being injected via client payloads
    if (parsedTargetAmount <= 0 || parsedDurationMonths <= 0 || fundingDeposit < 0) {
      return {
        success: false,
        error: "Invalid monetary or timing inputs detected.",
      };
    }

    // 2. If initial funding is provided, check if the account has enough money
    if (fundingDeposit > 0) {
      const selectedAccount = await Account.findById(accountId);
      if (!selectedAccount) {
        return {
          success: false,
          error: "Target funding account profile not found.",
        };
      }

      // Safeguard balance calculation checks
      const availableBalance = parseFloat(
        selectedAccount.balance?.$numberDecimal || selectedAccount.balance || 0,
      );
      
      if (availableBalance < fundingDeposit) {
        return {
          success: false,
          error: "Insufficient account balance for initial allocation.",
        };
      }

      // 3. Log a history transaction entry detailing the balance subtraction
      let newTransaction = await Transaction.create({
        accountId,
        user: userId,
        amount: fundingDeposit,
        type: "Expense",
        category: "savings",
        description: `Initial funding allocation for goal: ${name}`,
        date: new Date(),
        isRecurring: false,
        status: "COMPLETED",
      });

      // 4. ATOMIC CORRECTION: Deduct balance ONCE and push transaction reference ID simultaneously
      await Account.findByIdAndUpdate(accountId, {
        $inc: { balance: -fundingDeposit },
        $push: { Transaction: newTransaction._id }, 
      });

      // 5. Push the Transaction ID into the User model's reference array
      await User.findByIdAndUpdate(userId, {
        $push: { Transaction: newTransaction._id },
      });
    }

    // 6. Instantiate and write the clean savings target milestone back to MongoDB
    const newGoal = await SavingsGoal.create({
      userId,
      name,
      targetAmount: parsedTargetAmount,
      durationMonths: parsedDurationMonths,
      currentAmount: fundingDeposit,
      thisMonthContribution: fundingDeposit,
      startDate: new Date(),
      lastMonthResetDate: new Date(),
    });

    // 7. Purge Next.js route validation cache to pull freshly added records instantly
    revalidatePath(`/dashboard/${userId}`);
    
    return { success: true, goalId: newGoal._id.toString() };
  } catch (error) {
    console.error("Critical server-side execution pipeline failure:", error);
    return { success: false, error: "Internal ledger processing crash." };
  }
}