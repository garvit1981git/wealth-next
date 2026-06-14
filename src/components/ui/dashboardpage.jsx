"use client";
import React, { useEffect, useState } from "react";
import CreateAccountDrawer from "@/components/ui/CreateDrawer";
import { Plus } from "lucide-react";
import AccountCardList from "./accountcard";
import GetUserBudget from "@/app/actions/GetUserBudget";
import BudgetProgress from "./BudgetProgress";
import PieChart from "./PieChart";
import DefAccountRecList from "./DefAccountRecList";
import EmailInsightsButton from "./Emailbutton";

let Dashboardpage = ({ user, budget }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  console.log("this is useer accounts", user.accounts);
  let [acc, setacc] = useState("");
  return (
    <div className="p-6 flex flex-col gap-10">
      <h1 className="capitalize text-5xl font-bold text-primaryText mb-6">
        dashboard for {user.name}
      </h1>
      {user.Transaction.length == 0 ? null : (
        <>
          <BudgetProgress budget={budget} />
        </>
      )}
      {/* pie chart */}
      {user.Transaction.length == 0 ? null : (
        <>
          <div className="flex justify-between items-start gap-30">
            <DefAccountRecList userid={user._id} setacc={setacc} acc={acc} />
            <PieChart userid={user._id} setacc={setacc} acc={acc} />
          </div>
        </>
      )}
      {budget === 0 ? null : (
        <div className="flex justify-end">
          <EmailInsightsButton userId={user._id} email={user.email} />
        </div>
      )}
      {/* <EmailInsightsButton userId={user._id} email={user.email} /> */}
      <div className="grid grid-cols-3 gap-6">
        {/* Add new account */}

        <CreateAccountDrawer>
          <div className="bg-mainBg rounded-xl  border-cardBorder shadow-sm hover:shadow-md transition p-10 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
            <Plus className="h-10 w-10 text-primaryText" />
            <div className="text-secondaryText font-bold mt-3">
              Add new account
            </div>
          </div>
        </CreateAccountDrawer>

        {/* All account cards here */}
        <AccountCardList />
      </div>
    </div>
  );
};

export default Dashboardpage;
