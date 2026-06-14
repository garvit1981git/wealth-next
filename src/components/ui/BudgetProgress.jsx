"use client";

import { Check, Pencil, X } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { Input } from "./input";
import UpdateBudget from "@/app/actions/UpdateBudget";
import { Progress } from "./progress";

let BudgetProgress = ({ budget }) => {
  if (!budget || !budget.budgetobjparsed) return null;
  let [edit, setedit] = useState(false);
  console.log("this ius budget in progress", budget);
  let budgetamt = parseFloat(
    budget.budgetobjparsed.Amount.$numberDecimal,
  ).toFixed(2);
  let totalexpanses = budget.totalexpenses.toFixed(2);
  let [value, setvalue] = useState(budgetamt);
  let [uibudget, setuibudget] = useState(budgetamt);
  console.log(budgetamt);
  let handleedit = async () => {
    setedit(true);
  };
  let canceleditbudget = async () => {
    setedit(false);
  };
  let handleChange = async (e) => {
    console.log(e.target.value);
    setvalue(e.target.value); // let res = await UpdateBudget(budget.budgetobjparsed._id);
  };
  let handlebudgetchange = async () => {
    console.log("b is ", value);
    let res = await UpdateBudget(budget.budgetobjparsed._id, value);
    if (!res) {
      throw new Error("error");
    }
    setuibudget(value);
    setedit(false);
    console.log("b is ", value);
  };
  let percentageused = (totalexpanses / uibudget) * 100;
    const progressStyle = {
    background:` linear-gradient(
  90deg,
  #10b981 0%,  
  #10b981 50%,  
  #f59e0b 75%, 
  #ef4444 100%    
)`
  };

  return (
    <>
      <div className="rounded-2xl  border-cardBorder bg-mainBg p-6 flex flex-col gap-4 shadow-sm">
        <h1 className="text-lg font-semibold text-primaryText capitalize">
          monthly budget
          <span className="block text-xs font-normal text-secondaryText">
            default account
          </span>
        </h1>

        {edit ? (
          <div className="space-y-3  border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded">
            <Input
              value={value}
              type="number"
              step="0.01"
              onChange={(e) => handleChange(e)}
              placeholder="Enter amount"
              className="text-sm border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
            />

            <div className="flex gap-4">
              <button
                onClick={canceleditbudget}
                className="p-2 rounded-full hover:bg-red-50 transition"
              >
                <X className="text-red-600 h-5 w-5" />
              </button>

              <button
                onClick={handlebudgetchange}
                className="p-2 rounded-full hover:bg-green-50 transition"
              >
                <Check className="text-green-600 h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {uibudget === 0 ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondaryText">No budget set</p>
                <Pencil
                  onClick={handleedit}
                  className="h-4 w-4 cursor-pointer text-secondaryText hover:text-gray-700"
                />
              </div>
            ) : uibudget ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primaryText">
                    <span className="font-medium text-primaryText">
                      {totalexpanses}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-primaryText">
                      {uibudget}
                    </span>{" "}
                    spent
                  </p>

                  <Pencil
                    onClick={handleedit}
                    className="h-4 w-4 cursor-pointer text-secondaryText hover:text-gray-700"
                  />
                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(percentageused, 100)}%`,
                      ...progressStyle,
                    }}
                  />
                </div>

                <p className="text-xs text-secondaryText text-right">
                  {!uibudget || uibudget == 0 ? (
                    <>0 % used</>
                  ) : (
                    <>{percentageused.toFixed(2)}% used</>
                  )}
                </p>
              </div>
            ) : (
              <Button size="sm" onClick={handleedit}>
                Add budget
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default BudgetProgress;
