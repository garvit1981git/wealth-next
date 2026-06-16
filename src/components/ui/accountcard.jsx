"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GetUserAccounts from "@/app/actions/GetUserAccounts";
import { Switch } from "./switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import CreateAccountDef from "@/app/actions/createaccdefault";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
// import { Button } from "./button";
import * as Icons from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import DeleteAcc from "@/app/actions/DeleteAcc";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./select";

export default function AccountCardList() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);

  async function handleToggle(acc) {
    await CreateAccountDef(acc.id);
    setAccounts((prev) =>
      prev.map(
        (a) =>
          a.id === acc.id
            ? { ...a, isDefault: true } // make toggled account default
            : { ...a, isDefault: false }, // remove default from others
      ),
    );
  }

  useEffect(() => {
    async function fetchAccounts() {
      const data = await GetUserAccounts();
      setAccounts(data || []);
    }
    fetchAccounts();
  }, []);
  let HandleAccDel = async (Accid) => {
    console.log("this is accid", Accid);
    let res = await DeleteAcc(Accid);
  };
  return (
    <>
      {accounts.map((acc) => (
        <div
          key={acc.id}
          onClick={() => router.push(`/account/${acc.id}`)}
          className="
            bg-mainBg
          rounded-xl
           border-cardBorder
          shadow-sm
          hover:shadow-md
          transition
          p-6
          cursor-pointer
          flex flex-col
          gap-3
          min-h-[200px]
           max-w-117.5
        "
        >
          <div className="flex  justify-between items-center">
            <div className="text-lg font-semibold text-primaryText capitalize">
              {acc.accountname}
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Switch
                checked={acc.isDefault}
                onCheckedChange={() => handleToggle(acc)}
                className="
    data-[state=checked]:bg-emerald-500 
    data-[state=unchecked]:bg-slate-200 
    dark:data-[state=unchecked]:bg-slate-700
    [&>span]:bg-white 
    dark:[&>span]:bg-slate-100
  "
              />
            </div>
          </div>

          <div className="sm:text-3xl text-2xl font-bold text-primaryText">
            ₹{acc.balance}
          </div>

          <div className="text-sm text-secondaryText">{acc.type} account</div>
          <div className="flex justify-between">
            <div className="flex  items-center gap-4 text-sm text-secondaryText mt-1">
              <div className="flex items-center gap-1">
                <ArrowUpRight className="text-green-500 h-4 w-4" /> Income
              </div>
              <div className="flex items-center gap-1">
                <ArrowDownRight className="text-red-500 h-4 w-4" /> Expense
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 hover:bg-white/5 rounded-lg transition-colors focus:outline-none">
                <Icons.MoreHorizontal
                  size={16}
                  className="text-[var(--theSecondaryText)] hover:text-[var(--thePrimaryText)] transition-colors cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[var(--mainBg)] border border-[var(--card-border)] text-[var(--thePrimaryText)] rounded-xl shadow-xl min-w-[120px]">
                {/* <Link href={}> */}
                <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-[var(--thePrimaryText)] px-3 py-2 rounded-lg text-sm">
                  Edit
                </DropdownMenuItem>
                {/* </Link> */}
                <DropdownMenuItem
                  className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 px-3 py-2 rounded-lg text-sm font-medium"
                  onClick={() => HandleAccDel(acc.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </>
  );
}
