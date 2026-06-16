import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
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

import { Checkbox } from "./checkbox";
import { useState } from "react";
import { Input } from "./input";
import DeleteTransactions from "@/app/actions/DeleteTransactions";
import EditTransaction from "@/app/actions/EditTransaction";
import Link from "next/link";

const categoryMap = Object.fromEntries(defaultCategories.map((c) => [c.id, c]));

const TransactionList = ({ Transactions = [], currentpage, totalpage }) => {
  let [transactions, settransactions] = useState(Transactions);
  let [sort, setsort] = useState({
    field: "date",
    direction: "desc",
  });

  // console.log("tottal pages are", totalpage);
  console.log(
    "page",
    currentpage,
    currentpage.startindex,
    currentpage.endindex,
  );
  let [selectIds, setselectIds] = useState([]);

  const [typeFilter, setTypeFilter] = useState("all");
  const [recurringFilter, setRecurringFilter] = useState("all");
  const [search, setSearch] = useState("");

  let handleSort = (type, e) => {
    setsort({
      field: type,
      direction: sort.direction == "desc" ? "asc" : "desc",
    });
    // console.log(sort);
  };
  let handledelete = (e, id) => {
    // setselectIds(id)
    if (e) {
      // console.log(id);
    }
    setselectIds((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id],
    );
  };
  let handledeleteAll = (allIds) => {
    setselectIds((current) => (current.length === allIds.length ? [] : allIds));
  };
  let HandleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setRecurringFilter("all");
    setselectIds([]);
  };
  let hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    recurringFilter !== "all" ||
    selectIds.length > 0;

  let filteredtransaction = transactions.filter((t) => {
    let checktypefilter =
      typeFilter != "all" ? t.type.toLowerCase() == typeFilter : t;
    let checkreccuringfilter =
      recurringFilter != "all"
        ? t.isRecurring.toString() == recurringFilter
        : t;
    let checkSearchFilter = search
      ? t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      : t;
    // console.log("this", checkreccuringfilter && checktypefilter);

    return checkreccuringfilter && checktypefilter && checkSearchFilter;

    // sorrting
  });
  // true && true && true → transaction is included
  // true && true && true → transaction is included
  // true && true && true → transaction is included
  // console.log("filtered", filteredtransaction);
  let sortedTransactions = [...filteredtransaction].sort((a, b) => {
    if (!sort.field) {
      return 0;
    }
    let avalue = a[sort.field];
    let bvalue = b[sort.field];
    if (sort.field == "amount") {
      let valA = a.type == "Expense" ? -avalue : avalue;
      let valB = b.type == "Expense" ? -bvalue : bvalue;
      // console.log(sort.direction == "asc" ? avalue - bvalue : bvalue - avalue);
      return sort.direction == "asc" ? valA - valB : valB - valA;
    }
    if (sort.field == "date") {
      // console.log(sort.direction == "asc" ? avalue - bvalue : bvalue - avalue);
      return sort.direction == "asc"
        ? new Date(avalue) - new Date(bvalue)
        : new Date(bvalue) - new Date(avalue);
    }
    if (sort.field == "isRecurring") {
      // console.log(sort.direction == "asc" ? avalue - bvalue : bvalue - avalue);

      return sort.direction == "asc" ? avalue - bvalue : bvalue - avalue;
    }
    // sort.field == "amount" &&
    //   sort.direction == "asc" &&

    // sort.field == "amount" &&
    //   sort.direction == "desc" &&
    //   Transactions.amount.sort((a, b) => b - a);
  });

  let HandleBulkDelete = async () => {
    // console.log("this is acc", Transactions[0].accountId);
    let res = await DeleteTransactions(
      selectIds,
      Transactions[0].accountId,
      Transactions[0].user,
    );
    settransactions((prev) => prev.filter((t) => !selectIds.includes(t._id)));
    // console.log(res);
    setselectIds([]);
  };
  // let Handleedit = async (e, t) => {
  //   let res = await EditTransaction(t._id);
  //   console.log(e);
  //   console.log(t);
  // };
  let HandleManualdel = async (id) => {
    console.log("manual del", id);
    let res = await DeleteTransactions(
      [id],
      Transactions[0].accountId,
      Transactions[0].user,
    );
    settransactions((prev) => prev.filter((t) => ![id].includes(t._id)));
  };
  return (
    <div className="bg-mainBg rounded-xs border overflow-x-hidden">
      <div className="flex lg:hidden items-center justify-between gap-2 sm:gap-4 p-4  border-b">
        {selectIds.length > 0 ? (
          <>
            <div className="relative w-full">
              <Icons.Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primaryText"
              />
              <Input
                placeholder="Search transactions..."
                className="pl-6 sm:pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="p-0"
              variant="destructive"
              size="sm"
              onClick={() => HandleBulkDelete()}
            >
              <Icons.Trash />
              Delete Selected ({selectIds.length})
            </Button>
            {hasActiveFilters && (
              <Button className="p-0" onClick={() => HandleClearFilters()}>
                <Icons.X />
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Search */}
            <div className="relative w-full">
              <Icons.Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primaryText"
              />
              <Input
                placeholder="Search transactions..."
                className="pl-6 sm:pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className=" sm:w-50">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-mainBg shadow-sm">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              {/* Recurring Filter */}
              <Select
                value={recurringFilter}
                onValueChange={setRecurringFilter}
              >
                <SelectTrigger className="sm:w-50">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent className="bg-mainBg shadow-sm">
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="true">Recurring</SelectItem>
                  <SelectItem value="false">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right actions (example) */}

            {hasActiveFilters && (
              <Button className="p-0" onClick={() => HandleClearFilters()}>
                <Icons.X />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="lg:flex hidden items-center justify-between gap-2 sm:gap-4 p-4  border-b">
        {/* Search */}
        <div className="relative w-full">
          <Icons.Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primaryText"
          />
          <Input
            placeholder="Search transactions..."
            className="pl-6 sm:pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className=" sm:w-50">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-mainBg shadow-sm">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Recurring Filter */}
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="sm:w-50">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-mainBg shadow-sm">
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="true">Recurring</SelectItem>
              <SelectItem value="false">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right actions (example) */}

        {selectIds.length > 0 ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => HandleBulkDelete()}
          >
            <Icons.Trash />
            Delete Selected ({selectIds.length})
          </Button>
        ) : null}

        {/* { cross button} */}
        {hasActiveFilters && (
          <Button onClick={() => HandleClearFilters()}>
            <Icons.X />
          </Button>
        )}
      </div>
      <div
        className="w-full smooth-scrollbar
     rounded-xl bg-mainBg shadow-md"  
      >
        <table className="w-full min-w-[600px] sm:min-w-full text-sm border-collapse">
          <thead className="border-b border-[var(--card-border)] bg-[var(--mainBg)] text-[var(--thePrimaryText)]">
            <tr>
              {/* Checkbox Column */}
              <th className="p-3 sm:px-4 sm:py-3.5 text-left w-12">
                <Checkbox
                  onCheckedChange={(e) => {
                    handledeleteAll(Transactions.map((t) => t._id));
                  }}
                  checked={selectIds.length === Transactions.length}
                />
              </th>

              {/* Date Column */}
              <th
                className="p-3 sm:px-4 sm:py-3.5 text-left cursor-pointer hover:bg-white/5 transition-colors select-none"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1.5 font-semibold text-[var(--thePrimaryText)]">
                  <span>Date</span>
                  {sort.field === "date" &&
                    (sort.direction === "asc" ? (
                      <Icons.ChevronUp
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ) : (
                      <Icons.ChevronDown
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ))}
                </div>
              </th>

              {/* Description Column */}
              <th className="p-3 sm:px-4 sm:py-3.5 text-left font-semibold text-[var(--thePrimaryText)]">
                Description
              </th>

              {/* Category Column */}
              <th className="p-3 sm:px-4 sm:py-3.5 text-left font-semibold text-[var(--thePrimaryText)]">
                Category
              </th>

              {/* Amount Column */}
              <th
                className="p-3 sm:px-4 sm:py-3.5 text-right cursor-pointer hover:bg-white/5 transition-colors select-none"
                onClick={() => handleSort("amount")}
              >
                <div className="flex gap-1.5 justify-end font-semibold text-[var(--thePrimaryText)]">
                  <span>Amount</span>
                  {sort.field === "amount" &&
                    (sort.direction === "asc" ? (
                      <Icons.ChevronUp
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ) : (
                      <Icons.ChevronDown
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ))}
                </div>
              </th>

              {/* Recurring Column */}
              <th
                className="p-3 sm:px-4 sm:py-3.5 text-center cursor-pointer hover:bg-white/5 transition-colors select-none w-28"
                onClick={() => handleSort("isRecurring")}
              >
                <div className="flex items-center gap-1.5 justify-center font-semibold text-[var(--thePrimaryText)]">
                  <span>Recurring</span>
                  {sort.field === "isRecurring" &&
                    (sort.direction === "asc" ? (
                      <Icons.ChevronUp
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ) : (
                      <Icons.ChevronDown
                        size={14}
                        className="text-[var(--accent-light)]"
                      />
                    ))}
                </div>
              </th>

              {/* Actions Column */}
              <th className="p-3 sm:px-4 sm:py-3.5 w-12"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--card-border)] text-[var(--thePrimaryText)]">
            {sortedTransactions
              .slice(currentpage.startindex, currentpage.endindex)
              .map((t) => {
                const category = categoryMap[t.category];
                const Icon = Icons[category?.icon] || Icons.MoreHorizontal;

                return (
                  <tr
                    key={t._id}
                    className="hover:bg-white/[0.02] transition-colors border-b border-[var(--card-border)] last:border-none"
                  >
                    {/* Checkbox Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 text-[var(--theSecondaryText)] align-middle">
                      <Checkbox
                        onCheckedChange={(e) => {
                          handledelete(e, t._id);
                        }}
                        checked={selectIds.includes(t._id)}
                      />
                    </td>

                    {/* Date Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 whitespace-nowrap text-[var(--theSecondaryText)] font-medium align-middle">
                      {new Date(t.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Description Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 capitalize font-medium text-[var(--thePrimaryText)] max-w-[180px] sm:max-w-xs truncate align-middle">
                      {t.description || "—"}
                    </td>

                    {/* Category Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 whitespace-nowrap align-middle">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                        style={{
                          backgroundColor: `${category?.color}15`,
                          color: category?.color,
                          border: `1px solid ${category?.color}30`,
                        }}
                      >
                        <Icon size={12} />
                        {category?.name}
                      </span>
                    </td>

                    {/* Amount Cell */}
                    <td
                      className={`p-3 sm:px-4 sm:py-3.5 text-right font-bold whitespace-nowrap align-middle tracking-tight text-base ${
                        t.type === "Income"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {t.type === "Income" ? "+" : "-"}₹
                      {t.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Recurring Status Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 text-center align-middle whitespace-nowrap">
                      {t.isRecurring && t.nextRecurringDate ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-500/10 text-[var(--accent-light)] border border-[var(--accent-light)]/20 cursor-pointer transition-all hover:bg-purple-500/20">
                              {t.recurringInterval}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[var(--mainBg)] border border-[var(--card-border)] text-[var(--thePrimaryText)] p-2 rounded-lg text-xs shadow-xl">
                            <p className="font-medium">
                              Next Date:{" "}
                              <span className="text-[var(--theSecondaryText)]">
                                {new Date(
                                  t.nextRecurringDate,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-neutral-800 text-[var(--theSecondaryText)] border border-[var(--card-border)]">
                          One-time
                        </span>
                      )}
                    </td>

                    {/* Dropdown Menu Actions Cell */}
                    <td className="p-3 sm:px-4 sm:py-3.5 text-right align-middle w-12">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-white/5 rounded-lg transition-colors focus:outline-none">
                          <Icons.MoreHorizontal
                            size={16}
                            className="text-[var(--theSecondaryText)] hover:text-[var(--thePrimaryText)] transition-colors cursor-pointer"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[var(--mainBg)] border border-[var(--card-border)] text-[var(--thePrimaryText)] rounded-xl shadow-xl min-w-[120px]">
                          <Link href={`/transaction/create?edit=${t._id}`}>
                            <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-[var(--thePrimaryText)] px-3 py-2 rounded-lg text-sm">
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 px-3 py-2 rounded-lg text-sm font-medium"
                            onClick={() => HandleManualdel(t._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {/* <p>this is page</p> */}
    </div>
  );
};

export default TransactionList;
