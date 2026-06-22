"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createTransferSchema } from "./transferSchema";
import { ArrowRightLeft, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTransferSchema } from "@/lib/formschema";
import TransferFunds from "@/app/actions/TransferFunds";
// import { createTransferSchema } from "@/lib/formschema";
// import TransferFunds from "./TransferFunds";
// import TransferFunds from "@/app/actions/TransferFunds"; // Adjust path as needed

const AmountTransfer = ({ id, allAcc = [] }) => {
  const router = useRouter();

  // 1. Locate current source account details and evaluate available balance
  const sourceAccount = useMemo(() => {
    return allAcc.find((acc) => acc._id === id);
  }, [id, allAcc]);

  const sourceBalance = useMemo(() => {
    if (!sourceAccount) return 0;
    return parseFloat(sourceAccount.balance?.$numberDecimal || sourceAccount.balance || 0);
  }, [sourceAccount]);

  // 2. Filter target list to exclude the current active account
  const destinationAccounts = useMemo(() => {
    return allAcc.filter((acc) => acc._id !== id);
  }, [id, allAcc]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(createTransferSchema(sourceBalance)),
    defaultValues: {
      targetAccountId: "",
      amount: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!sourceAccount) return;

      const payload = {
        userId: sourceAccount.user,
        sourceAccountId: id,
        targetAccountId: data.targetAccountId,
        amount: data.amount,
      };

      const res = await TransferFunds(payload);

      if (res.success) {
        alert("💸 Account funds successfully routed internally!");
        reset();
        router.refresh();
      } else {
        alert(`Transfer Failed: ${res.error}`);
      }
    } catch (err) {
      console.error("Funds routing form failure:", err);
    }
  };

  return (
    <div className="bg-mainBg border border-cardBorder rounded-2xl p-5 max-w-md mx-auto shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-accentLight/10 text-accentLight rounded-xl border border-accentLight/20">
          <ArrowRightLeft size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-primaryText tracking-tight">Transfer Funds</h2>
          <p className="text-[11px] text-secondaryText">Move balance across asset profiles</p>
        </div>
      </div>

      {/* Source Account Metadata Information Block */}
      <div className="mb-4 p-3 bg-pureBg/40 border border-cardBorder/60 rounded-xl flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="text-[10px] text-secondaryText font-bold uppercase tracking-wider">Source Account</span>
          <p className="text-xs font-bold text-primaryText capitalize">{sourceAccount?.accountname || "Unknown"}</p>
        </div>
        <div className="text-right space-y-0.5">
          <span className="text-[10px] text-secondaryText font-bold uppercase tracking-wider">Available Pool</span>
          <p className="text-xs font-bold font-mono text-accentLight">₹{sourceBalance.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        
        {/* Destination Selection Menu */}
        <div>
          <label className="block mb-1 text-[11px] font-bold text-secondaryText uppercase tracking-wider">
            Destination Account
          </label>
          <select
            {...register("targetAccountId")}
            className="border border-cardBorder bg-pureBg text-primaryText p-2 w-full rounded-xl text-xs font-medium focus:outline-none focus:border-accentLight transition-colors capitalize"
          >
            <option value="">Select Target Account</option>
            {destinationAccounts.map((acc) => {
              const bal = parseFloat(acc.balance?.$numberDecimal || acc.balance || 0);
              return (
                <option key={acc._id} value={acc._id}>
                  {acc.accountname} (₹{bal.toLocaleString("en-IN")})
                </option>
              );
            })}
          </select>
          {errors.targetAccountId && (
            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.targetAccountId.message}</p>
          )}
        </div>

        {/* Transfer Value Input */}
        <div>
          <label className="block mb-1 text-[11px] font-bold text-secondaryText uppercase tracking-wider">
            Amount to Transfer (₹)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-secondaryText font-mono">₹</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
              className="border border-cardBorder bg-pureBg text-primaryText pl-7 pr-3 py-2 w-full rounded-xl text-xs font-mono focus:outline-none focus:border-accentLight transition-colors"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.amount.message}</p>
          )}
        </div>

        {/* Action Button Trigger */}
        <button
          type="submit"
          disabled={isSubmitting || destinationAccounts.length === 0}
          className="bg-accentLight hover:bg-accentDark disabled:opacity-40 text-white font-bold w-full mt-1 py-2 rounded-xl text-xs tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? "Routing Balances..." : "Execute Transfer"}
        </button>

        {destinationAccounts.length === 0 && (
          <p className="text-center text-[10px] text-amber-500 font-semibold mt-1">
            ⚠️ You need at least one alternative account to process a transfer.
          </p>
        )}
      </form>
    </div>
  );
};

export default AmountTransfer;