import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary";
//
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
//

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
    <div className="bg-mainBg rounded-xl border">
      <div className="flex items-center justify-between gap-4 p-4 border-b">
        {/* Search */}
        <div className="relative w-full">
          <Icons.Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primaryText"
          />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
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
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
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
      <table className="w-full text-sm">
        <thead className="border-b bg-mainBg text-primaryText">
          <tr>
            <th className="px-4 py-3 text-left">
              <Checkbox
                onCheckedChange={(e) => {
                  handledeleteAll(Transactions.map((t) => t._id));
                }}
                checked={selectIds.length === Transactions.length}
              />
            </th>

            <th
              className="px-4 py-3 text-left cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-1">
                <span>Date</span>
                {sort.field === "date" &&
                  (sort.direction === "asc" ? (
                    <Icons.ChevronUp size={16} />
                  ) : (
                    <Icons.ChevronDown size={16} />
                  ))}
              </div>
            </th>

            <th className="px-4 py-3 text-left">Description</th>

            <th className="px-4 py-3 text-left">Category</th>

            <th
              className="px-4 py-3 text-right cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center gap-1 justify-end">
                <span>Amount</span>
                {sort.field === "amount" &&
                  (sort.direction === "asc" ? (
                    <Icons.ChevronUp size={16} />
                  ) : (
                    <Icons.ChevronDown size={16} />
                  ))}
              </div>
            </th>

            <th
              className="px-4 py-3 text-center cursor-pointer"
              onClick={() => handleSort("isRecurring")}
            >
              <div className="flex items-center gap-1 justify-center">
                <span>Recurring</span>
                {sort.field === "isRecurring" &&
                  (sort.direction === "asc" ? (
                    <Icons.ChevronUp size={16} />
                  ) : (
                    <Icons.ChevronDown size={16} />
                  ))}
              </div>
            </th>

            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {sortedTransactions
            .slice(currentpage.startindex, currentpage.endindex)
            .map((t) => {
              const category = categoryMap[t.category];
              const Icon = Icons[category?.icon] || Icons.MoreHorizontal;

              return (
                <tr key={t._id} className="border-b last:border-none">
                  <td className="px-4 py-3 text-secondaryText">
                    <Checkbox
                      onCheckedChange={(e) => {
                        handledelete(e, t._id);
                      }}
                      checked={selectIds.includes(t._id)}
                    />
                  </td>
                  <td className="px-4 py-3 ">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {t.description || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${category?.color}20`,
                        color: category?.color,
                      }}
                    >
                      <Icon size={14} />
                      {category?.name}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      t.type === "Income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "Income" ? "+" : "-"}₹{t.amount}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {t.isRecurring && t.nextRecurringDate ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs px-2 py-1 rounded-full border cursor-pointer">
                            {t.recurringInterval}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Next Date :
                            {new Date(t.nextRecurringDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full border">
                        One-time
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {/* <Button variant="ghost" className="p-0"> */}
                        <Icons.MoreHorizontal
                          size={16}
                          className="text-gray-400"
                        />
                        {/* </Button> */}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link href={`/transaction/create?edit=${t._id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="hover:bg-black hover:text-white"
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
      {/* <p>this is page</p> */}
    </div>
  );
};

export default TransactionList;
