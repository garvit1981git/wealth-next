"use client"
import React, { useMemo } from "react";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { savingsGoalSchema } from "./goalSchema"; // Adjust path as necessary
import { savingsGoalSchema } from "@/lib/formschema";
import { useForm } from "react-hook-form";
import CreateSavingsGoal from "@/app/actions/CreateSavingsGoal";
import { useRouter } from "next/navigation";
// import { Router, useRouter } from "next/router";

const CreateGoalPage =  ({acc}) => {
const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      durationMonths: "",
      accountId: "",
      initialFunding: 0,
    },
  });

  // Watch fields programmatically to show live metrics calculation!
  const targetAmount = watch("targetAmount");
  const durationMonths = watch("durationMonths");

  const calculatedMonthlyTarget = useMemo(() => {
    const amt = parseFloat(targetAmount);
    const months = parseInt(durationMonths, 10);
    if (!isNaN(amt) && !isNaN(months) && months > 0) {
      return Math.round(amt / months);
    }
    return 0;
  }, [targetAmount, durationMonths]);

const onSubmit = async (data) => {
  try {
    const payload = {
      userId: acc[0].user,
      name: data.name,
      targetAmount: parseFloat(data.targetAmount),
      durationMonths: parseInt(data.durationMonths, 10),
      currentAmount: parseFloat(data.initialFunding) || 0,
      thisMonthContribution: parseFloat(data.initialFunding) || 0,
      accountId: data.accountId,
    };

    // 1. Fire and await the Server Action execution promise block
    const res = await CreateSavingsGoal(payload);
if (res.success) {
        // 4. Redirect smoothly to the user's specific dashboard path profile
        router.push(`/dashboard`);
      } else {
        alert(`Failed to create savings goal: ${res.error}`);
      }

  } catch (error) {
    console.error("Submission pipeline error:", error);
  }
};

  return (
    <div className="bg-mainBg border border-cardBorder rounded-2xl p-6 max-w-lg mx-auto shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primaryText">
          Establish Savings Target
        </h2>
        <p className="text-xs text-secondaryText mt-1">
          Set a clear milestone bucket to pace your strategic lifestyle asset
          accumulation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Goal Purpose / Name
          </label>
          <input
            type="text"
            placeholder="e.g., New Bike, Emergency Fund, Tesla"
            {...register("name")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm focus:outline-none focus:border-accentLight transition-colors"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Target Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("targetAmount")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm font-mono focus:outline-none focus:border-accentLight transition-colors"
          />
          {errors.targetAmount && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.targetAmount.message}
            </p>
          )}
        </div>

        {/* Goal Duration Months */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Goal Duration (Months)
          </label>
          <input
            type="number"
            placeholder="e.g., 10"
            {...register("durationMonths")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm font-mono focus:outline-none focus:border-accentLight transition-colors"
          />
          {errors.durationMonths && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.durationMonths.message}
            </p>
          )}
        </div>
{/* Account Selection Dropdown Block */}
<div>
  <label className="block mb-1 text-sm font-medium text-primaryText">
    Source Funding Profile
  </label>
  <select
    {...register("accountId")}
    className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm focus:outline-none focus:border-accentLight transition-colors capitalize"
  >
    <option value="" className="text-secondaryText">
      Select Funding Account
    </option>
    {acc?.map((item) => {
      // 1. Explicitly isolate the correct primary key identifier safely
      const targetId = item.id || item._id;
      
      // 2. Format the human-readable text string natively
      const currentBalance = parseFloat(item.balance?.$numberDecimal || item.balance || 0);

      return (
        <option key={targetId} value={targetId}>
          {item.accountname} (₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
        </option>
      );
    })}
  </select>
  {errors.accountId && (
    <p className="text-red-500 text-xs mt-1 font-medium">
      {errors.accountId.message}
    </p>
  )}
</div>

        {/* Optional Initial Funding Field */}
        <div>
          <label className="block mb-1 text-sm font-medium text-primaryText">
            Initial Allocation Deposit (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("initialFunding")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2.5 w-full rounded-xl text-sm font-mono focus:outline-none focus:border-accentLight transition-colors"
          />
          {errors.initialFunding && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.initialFunding.message}
            </p>
          )}
        </div>

        {/* Dynamic Calculation Display Box */}
        {calculatedMonthlyTarget > 0 && (
          <div className="p-3.5 bg-accentLight/5 border border-accentLight/20 rounded-xl flex items-center justify-between">
            <span className="text-xs text-secondaryText font-medium">
              Estimated Monthly Pacing Requirement:
            </span>
            <span className="text-sm font-bold font-mono text-accentLight">
              ₹{calculatedMonthlyTarget.toLocaleString("en-IN")}/mo
            </span>
          </div>
        )}

        {/* Form Action CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accentLight hover:bg-accentDark disabled:opacity-50 text-white font-semibold w-full mt-2 px-4 py-2.5 rounded-xl text-sm tracking-wide shadow-sm transition-all cursor-pointer"
        >
          {isSubmitting ? "Initializing Bucket..." : "Save Financial Goal"}
        </button>
      </form>
    </div>
  );
};

export default CreateGoalPage;
