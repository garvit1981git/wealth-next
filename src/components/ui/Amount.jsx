"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { amountAllocationSchema } from "./amountSchema"; // Adjust path if needed
import { useRouter } from "next/navigation";
// import FundSavingsGoal from "@/app/actions/FundSavingsGoal"; // Your allocation server action
import { amountAllocationSchema } from "@/lib/formschema";
import AddingFund from "@/app/actions/AddingFund";

const Amount = ({ accountId, goals = [] }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(amountAllocationSchema),
    defaultValues: {
      goalId: goals.length === 1 ? goals[0]._id : "", // Auto-select if there's only one goal
      amount: "",
    },
  });

  // Watch fields programmatically to show real-time progress forecasting!
  const selectedGoalId = watch("goalId");
  const typedAmount = watch("amount");

  // Find the currently selected goal from the passed array
  const activeGoal = useMemo(() => {
    return goals.find((g) => g._id === selectedGoalId);
  }, [selectedGoalId, goals]);

  // Live progress preview calculation
  const progressPreview = useMemo(() => {
    if (!activeGoal) return null;
    const added = parseFloat(typedAmount) || 0;
    const nextTotal = activeGoal.currentAmount + added;
    const nextPercent = Math.min(
      Math.round((nextTotal / activeGoal.targetAmount) * 100),
      100,
    );
    return { nextTotal, nextPercent };
  }, [activeGoal, typedAmount]);

  const onSubmit = async (data) => {
    try {
      if (!goals || goals.length === 0) return;

      const userId = goals[0].userId;

      const payload = {
        userId,
        goalId: data.goalId,
        accountId: accountId,
        amount: data.amount,
      };

      // Fire allocation server action
      const res = await AddingFund(payload);

      if (res.success) {
        alert("💰 Capital successfully allocated to your savings goal!");
        router.push(`/dashboard`);
      } else {
        alert(`Transaction Denied: ${res.error}`);
      }
    } catch (error) {
      console.error("Allocation submission pipeline failure:", error);
    }
  };

  return (
    <div className="bg-mainBg border border-cardBorder rounded-2xl p-6 max-w-lg mx-auto shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primaryText">
          Allocate Savings Capital
        </h2>
        <p className="text-xs text-secondaryText mt-1">
          Move funds from your selected account straight into a dynamic
          milestone bucket.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Selection Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Target Savings Goal
          </label>
          <select
            {...register("goalId")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm focus:outline-none focus:border-accentLight transition-colors capitalize"
          >
            <option value="" className="text-secondaryText">
              Select a Goal
            </option>
            {goals.map((goal) => (
              <option key={goal._id} value={goal._id}>
                {goal.name} (Current: ₹
                {goal.currentAmount.toLocaleString("en-IN")} / Target: ₹
                {goal.targetAmount.toLocaleString("en-IN")})
              </option>
            ))}
          </select>
          {errors.goalId && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.goalId.message}
            </p>
          )}
        </div>

        {/* Deposit Amount Input */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Amount to Save (₹)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm font-mono focus:outline-none focus:border-accentLight transition-colors"
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Live Forecasting Display Panel */}
        {progressPreview && (
          <div className="p-4 bg-accentLight/5 border border-accentLight/20 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-medium text-secondaryText">
              <span>New Projected Total:</span>
              <span className="font-mono text-primaryText font-bold">
                ₹{progressPreview.nextTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-xs font-medium text-secondaryText">
              <span>Goal Progress Forecast:</span>
              <span className="font-mono text-accentLight font-bold">
                {progressPreview.nextPercent}% Achieved
              </span>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full h-1.5 bg-pureBg border border-cardBorder rounded-full overflow-hidden">
              <div
                className="h-full bg-accentLight transition-all duration-300 rounded-full"
                style={{ width: `${progressPreview.nextPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Action Button CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accentLight hover:bg-accentDark disabled:opacity-50 text-white font-semibold w-full mt-2 px-4 py-2.5 rounded-xl text-sm tracking-wide shadow-sm transition-all cursor-pointer text-center"
        >
          {isSubmitting ? "Processing Transfer..." : "Confirm Allocation"}
        </button>
      </form>
    </div>
  );
};

export default Amount;
