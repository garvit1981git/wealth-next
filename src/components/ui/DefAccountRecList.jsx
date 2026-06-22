"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import GetUserAccounts from "@/app/actions/GetUserAccounts";
import getdata from "@/app/actions/getdata";

const categoryMap = Object.fromEntries(defaultCategories.map((c) => [c.id, c]));

const DefAccountRecList = ({ userid, setacc, acc }) => {
  const [dataset, setDataset] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);

  // 1. Initial Load: Pull User Profiles & Default Settings
  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await GetUserAccounts();
      if (!res || res.length === 0) return;

      setAllAccounts(res);

      // Auto-set state to matching default account if currently unassigned
      const defaultAcc =
        res.find((account) => account.isDefault === true) || res[0];
      if (defaultAcc && !acc) {
        setacc(defaultAcc.accountname);
      }
    };
    fetchAccounts();
  }, [userid, setacc, acc]);

  // 2. Data Synchronization Layer: Fetch and Order Ledgers on State Shifts
  useEffect(() => {
    if (!acc) return;

    const fetchLedger = async () => {
      const res = await getdata(userid, acc);
      if (!res) return;

      const sortedData = [...res].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setDataset(sortedData);
    };
    fetchLedger();
  }, [userid, acc]);

  return (
    <div className="md:max-w-3xl mx-auto bg-mainBg border border-neutral-800 rounded-2xl shadow-sm w-full overflow-hidden">
      {/* Control Header Grid Block */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-800 bg-neutral-900/10">
        <h2 className="text-lg font-bold text-primaryText tracking-tight">
          Recent Transactions
        </h2>

        <Select value={acc || ""} onValueChange={setacc}>
          <SelectTrigger className="w-full sm:w-52 bg-mainBg capitalize border-neutral-800">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent className="bg-mainBg border border-neutral-800 text-primaryText shadow-xl capitalize">
            {allAccounts.map((a) => (
              <SelectItem key={a._id || a.accountname} value={a.accountname}>
                {a.accountname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Structured History Ledger Grid */}
      <div className="w-full overflow-x-auto smooth-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <tbody className="divide-y divide-neutral-800">
            {dataset.map((t) => {
              const category = categoryMap[t.category];
              const CustomIcon = Icons[category?.icon] || Icons.MoreHorizontal;

              return (
                <tr
                  key={t._id}
                  className="hover:bg-neutral-900/20 transition-colors group"
                >
                  {/* Ledger Column: Execution Date */}
                  <td className="px-5 py-4 text-secondaryText font-medium whitespace-nowrap align-middle">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Ledger Column: Internal Reference/Description */}
                  <td className="px-5 py-4 text-primaryText font-medium capitalize max-w-[200px] truncate align-middle">
                    {t.description || "—"}
                  </td>

                  {/* Ledger Column: Functional Tag Classification */}
                  <td className="px-5 py-4 align-middle whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                      style={{
                        backgroundColor: `${category?.color}12`,
                        color: category?.color,
                        border: `1px solid ${category?.color}25`,
                      }}
                    >
                      <CustomIcon
                        size={13}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                      {category?.name || "Other"}
                    </span>
                  </td>

                  {/* Ledger Column: Metric Balancing Value Statement */}
                  <td
                    className={`px-5 py-4 text-right font-bold font-mono tracking-tight text-base align-middle whitespace-nowrap ${
                      t.type === "Income" ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {t.type === "Income" ? "+" : "-"}₹
                    {t.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Contextual Blank State Empty Boundary Reminders */}
      {dataset.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <p className="text-secondaryText text-sm">
            No transaction execution records indexed for this account.
          </p>
        </div>
      )}
    </div>
  );
};

export default DefAccountRecList;
