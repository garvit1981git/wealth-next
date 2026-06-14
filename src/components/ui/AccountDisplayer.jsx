"use client";
import { useEffect, useState } from "react";
import AccountWithTransactions from "@/app/actions/AccountWithTransactions";
import { Wallet, CreditCard, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import Transactionlist from "./Transactionlist";
import { TooltipProvider } from "./tooltip";
import Chart from "./chart";
import GetUserBudget from "@/app/actions/GetUserBudget";

const AccountDisplayer = ({ accountId }) => {
  const [account, setAccount] = useState(null);
  const [totalcountnext, settotalcountnext] = useState(0);

  let [currentpage, setcurrentpage] = useState({
    startindex: 0,
    endindex: 5,
  });
  let [totalpage, settotalpage] = useState(1);
  let handlepagination = (e) => {
    settotalcountnext((current) => current + 1);
    // console.log(e);
    setcurrentpage((current) => ({
      startindex: current.startindex + 5,
      endindex: current.endindex + 5,
    }));
  };
  let handlepaginationback = (e) => {
    settotalcountnext((current) => current - 1);
    // console.log(e);
    setcurrentpage((current) => ({
      startindex: current.startindex - 5,
      endindex: current.endindex - 5,
    }));
  };
  useEffect(() => {
    async function getAccWithTransacs() {
      const res = await AccountWithTransactions(accountId);
      if (!res?.account) {
        notFound();
      }
      setAccount(res.account);
    }
    getAccWithTransacs();
  }, [accountId]);

  // let transactions = ((account.Transaction.length)/10)
  // let tpage = Math.ceil(transactions);
  // settotalpage(tpage)
  useEffect(() => {
    if (!account) return;
    const pages = Math.ceil(account.Transaction.length / 5);
    // console.log(account.Transaction.length / 10);
    // console.log(pages);
    settotalpage(pages);
  }, [account]);
  if (!account) return null;

  return (
    <main className="min-h-screen bg-pureBg px-10 py-8">
      {/* Page header */}
      <div className="mb-8 mt-5">
        <h1 className="text-4xl  text-primaryText capitalize font-black">
          {account.accountname}
        </h1>
        <p className="mt-1 text-secondaryText">{account.type} account</p>
      </div>

      {/* Top summary */}
      <section className="grid grid-cols-3 gap-6">
        {/* Balance */}
        <div className="col-span-2 rounded-2xl bg-mainBg p-10 shadow-sm">
          <p className="text-sm text-secondaryText">Current Balance</p>
          <p className="mt-3 text-4xl font-semibold text-primaryText flex items-center gap-2">
            ₹{account.balance.$numberDecimal}
          </p>
        </div>

        {/* Status */}
        <div className="rounded-2xl bg-mainBg p-8 shadow-sm">
          <p className="text-sm text-secondaryText">Account Status</p>

          {account.isDefault ? (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="font-medium">Default Account</span>
            </div>
          ) : (
            <span className="mt-4 block text-secondaryText">Standard Account</span>
          )}
        </div>
      </section>

      {/* Transactions section */}
      <section className="mt-10 rounded-2xl bg-mainBg p-10 shadow-sm ">
        <div className=" flex items-center gap-2">
          <CreditCard size={18} />
          <h2 className="text-xl font-semibold text-primaryText">
            Transactions Overview
          </h2>
        </div>

        {account.Transaction.length === 0 ? (
          <p className="text-secondaryText">
            No transactions found for this account.
          </p>
        ) : (
          <div className="mt-6">
            {/* { char } */}
            <Chart Transactions={account.Transaction}></Chart>

            {/* transaction list later */}
            <TooltipProvider>
              <Transactionlist
                Transactions={account.Transaction}
                currentpage={currentpage}
                totalpage={totalpage}
              ></Transactionlist>
            </TooltipProvider>
          </div>
        )}
        <div className="flex justify-center items-center gap-6 mt-4 text-primaryText  ">
          {account.Transaction.length !== 0 && (
            <>
              <button
                onClick={handlepaginationback}
                disabled={totalcountnext === 0}
                className="px-4 py-2 rounded-lg border-cardBorder text-primaryText disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-4 py-2 rounded-lg border bg-mainBg text-sm">
                Page {totalcountnext + 1} of {totalpage}
              </span>

              <button
                onClick={handlepagination}
                disabled={totalcountnext === totalpage - 1}
                className="px-4 py-2 rounded-lg border-cardBorder disabled:opacity-40"
              >
                Next
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default AccountDisplayer;
