"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

import DeleteTransactions from "@/app/actions/DeleteTransactions";

const categoryMap = Object.fromEntries(defaultCategories.map((c) => [c.id, c]));

const TransactionList = ({
  Transactions,
  currentpage,
  totalpage,
  handlepaginationback,
  handlepagination,
  account,
  totalcountnext,
}) => {
  const [transactions, setTransactions] = useState(Transactions);
  const [selectIds, setSelectIds] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [recurringFilter, setRecurringFilter] = useState("all");
  const [sort, setSort] = useState({ field: "date", direction: "desc" });

  // Sync state if initial prop changes
  useEffect(() => {
    setTransactions(Transactions);
  }, [Transactions]);

  // Handle individual row checking
  const handleSelectRow = (checked, id) => {
    setSelectIds((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id)
    );
  };

  // Toggle select all / clear all on current visible page view
  const handleSelectAllVisible = (allIds) => {
    setSelectIds((current) => (current.length === allIds.length ? [] : allIds));
  };

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setRecurringFilter("all");
    setSelectIds([]);
  };

  const handleSortToggle = (field) => {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  // 1. Pipeline Layer: Apply Interactive Multi-select Filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = typeFilter !== "all" ? t.type.toLowerCase() === typeFilter : true;
      const matchesRecurring = recurringFilter !== "all" ? t.isRecurring.toString() === recurringFilter : true;
      
      const searchLower = search.toLowerCase();
      const matchesSearch = search
        ? t.description?.toLowerCase().includes(searchLower) || t.category?.toLowerCase().includes(searchLower)
        : true;

      return matchesType && matchesRecurring && matchesSearch;
    });
  }, [transactions, typeFilter, recurringFilter, search]);

  // 2. Pipeline Layer: Sort Clean Filtered Subsets
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (!sort.field) return 0;
      
      let valA = a[sort.field];
      let valB = b[sort.field];

      if (sort.field === "amount") {
        valA = a.type === "Expense" ? -valA : valA;
        valB = b.type === "Expense" ? -valB : valB;
        return sort.direction === "asc" ? valA - valB : valB - valA;
      }

      if (sort.field === "date") {
        return sort.direction === "asc" ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      }

      if (sort.field === "isRecurring") {
        return sort.direction === "asc" ? (valA === valB ? 0 : valA ? 1 : -1) : (valA === valB ? 0 : valA ? -1 : 1);
      }

      return 0;
    });
  }, [filteredTransactions, sort]);

  // Action: Multi-Record Deletion
  const handleBulkDelete = async () => {
    if (selectIds.length === 0) return;
    await DeleteTransactions(selectIds, Transactions[0].accountId, Transactions[0].user);
    setTransactions((prev) => prev.filter((t) => !selectIds.includes(t._id)));
    setSelectIds([]);
  };

  // Action: Individual Record Deletion
  const handleSingleDelete = async (id) => {
    await DeleteTransactions([id], Transactions[0].accountId, Transactions[0].user);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    setSelectIds((current) => current.filter((item) => item !== id));
  };

  const hasActiveFilters = search.trim() !== "" || typeFilter !== "all" || recurringFilter !== "all" || selectIds.length > 0;
  const currentPagedItems = sortedTransactions.slice(currentpage.startindex, currentpage.endindex);

  return (
    <div className="border border-cardBorder rounded-2xl overflow-hidden p-4 sm:p-6 shadow-sm space-y-4 min-h-[300px] ">
      
      {/* Control Filter Toolbar */}
      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-3 bg-pureBg p-3 rounded-xl border border-cardBorder/60">
        <div className="relative flex-1 max-w-md">
          <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
          <Input
            placeholder="Search transactions..."
            className="pl-9 bg-mainBg border-cardBorder text-primaryText placeholder:text-secondaryText/60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Classification Select */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-mainBg border-cardBorder text-primaryText">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-mainBg border border-cardBorder text-primaryText">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Billing Interval Select */}
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-mainBg border-cardBorder text-primaryText">
              <SelectValue placeholder="All Schedules" />
            </SelectTrigger>
            <SelectContent className="bg-mainBg border border-cardBorder text-primaryText">
              <SelectItem value="all">All Schedules</SelectItem>
              <SelectItem value="true">Recurring</SelectItem>
              <SelectItem value="false">One-time</SelectItem>
            </SelectContent>
          </Select>

          {/* Contextual Bulk Destruction Trigger */}
          {selectIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
              <Icons.Trash size={14} />
              <span>Delete ({selectIds.length})</span>
            </Button>
          )}

          {/* Reset Engine Clear */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-secondaryText hover:text-primaryText">
              <Icons.X size={16} className="mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent rounded-xl h-[250px] border border-cardBorder ">
        <table className="w-full min-w-[700px] text-xs sm:text-sm text-left">
          <thead className="border-b border-cardBorder text-primaryText font-semibold">
            <tr>
              <th className="p-4 w-12 text-center">
                <Checkbox
                  onCheckedChange={() => handleSelectAllVisible(Transactions.map((t) => t._id))}
                  checked={Transactions.length > 0 && selectIds.length === Transactions.length}
                />
              </th>
              <th className="p-4 cursor-pointer hover:bg-pureBg/30 select-none transition-colors" onClick={() => handleSortToggle("date")}>
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  {sort.field === "date" && (sort.direction === "asc" ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />)}
                </div>
              </th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right cursor-pointer hover:bg-pureBg/30 select-none transition-colors" onClick={() => handleSortToggle("amount")}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Amount</span>
                  {sort.field === "amount" && (sort.direction === "asc" ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />)}
                </div>
              </th>
              <th className="p-4 text-center cursor-pointer hover:bg-pureBg/30 select-none transition-colors" onClick={() => handleSortToggle("isRecurring")}>
                <div className="flex items-center justify-center gap-1.5">
                  <span>Type</span>
                  {sort.field === "isRecurring" && (sort.direction === "asc" ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />)}
                </div>
              </th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cardBorder text-primaryText">
            {currentPagedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-secondaryText">
                  No matching transaction records found.
                </td>
              </tr>
            ) : (
              currentPagedItems.map((t) => {
                const category = categoryMap[t.category];
                const CustomIcon = Icons[category?.icon] || Icons.MoreHorizontal;

                return (
                  <tr key={t._id} className="hover:bg-mainBg transition-colors group">
                    <td className="p-4 text-center align-middle">
                      <Checkbox
                        onCheckedChange={(checked) => handleSelectRow(checked, t._id)}
                        checked={selectIds.includes(t._id)}
                      />
                    </td>
                    <td className="p-4 text-secondaryText font-medium whitespace-nowrap align-middle text-xs sm:text-sm">
                      {new Date(t.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 capitalize font-medium text-xs sm:text-sm max-w-[200px] truncate align-middle">
                      {t.description || "—"}
                    </td>
                    <td className="p-4 align-middle whitespace-nowrap">
                      <span
                        className="inline-flex text-xs sm:text-sm items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                        style={{
                          backgroundColor: `${category?.color}12`,
                          color: category?.color,
                          border: `1px solid ${category?.color}25`,
                        }}
                      >
                        <CustomIcon size={12} />
                        {category?.name || t.category}
                      </span>
                    </td>
                    <td className={`p-4 text-right text-xs sm:text-sm font-bold font-mono tracking-tight text-base align-middle whitespace-nowrap ${
                      t.type === "Income" ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      {t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center text-xs sm:text-sm align-middle whitespace-nowrap">
                      {t.isRecurring && t.nextRecurringDate ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-accentLight/10 text-accentLight border border-accentLight/20 cursor-pointer transition-colors hover:bg-accentLight/20">
                              {t.recurringInterval}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-mainBg border border-cardBorder text-primaryText p-2 rounded-lg text-xs shadow-xl">
                            <p className="font-medium">
                              Next Due:{" "}
                              <span className="text-secondaryText">
                                {new Date(t.nextRecurringDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-pureBg/60 text-secondaryText border border-cardBorder">
                          One-time
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-pureBg rounded-lg transition-colors focus:outline-none">
                          <Icons.MoreHorizontal size={16} className="text-secondaryText hover:text-primaryText transition-colors" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-mainBg border border-cardBorder text-primaryText rounded-xl shadow-xl min-w-[100px]">
                          <Link href={`/transaction/create?edit=${t._id}`} className="w-full">
                            <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm focus:bg-pureBg px-3 py-2 rounded-lg ">
                              Edit Details
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 px-3 py-2 rounded-lg text-xs sm:text-sm  font-medium"
                            onClick={() => handleSingleDelete(t._id)}
                          >
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footnotes */}
      {account?.Transaction?.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={handlepaginationback}
            disabled={totalcountnext === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-cardBorder bg-pureBg/30 text-primaryText disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pureBg/50 transition-colors"
          >
            Previous
          </button>

          <span className="px-4 py-2 rounded-lg border border-cardBorder bg-pureBg/60 text-xs font-medium font-mono text-secondaryText">
            Page {totalcountnext + 1} of {totalpage}
          </span>

          <button
            onClick={handlepagination}
            disabled={totalcountnext === totalpage - 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-cardBorder bg-pureBg/30 text-primaryText disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pureBg/50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;