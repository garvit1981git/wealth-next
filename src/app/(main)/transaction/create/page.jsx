import AboutUser from "@/app/actions/AboutUser";

import TransactionForm from "@/components/ui/TransactionForm";
import Mongoosedb from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import React from "react";
import Transaction from "../../../../../models/Transaction";

const transaction = async ({ searchParams }) => {
  await Mongoosedb();
  const resolvedSearchParams = await searchParams;

  // 3. Access the 'edit' key from the URL (?edit=YOUR_ID)
  const editId = resolvedSearchParams.edit;

  console.log("Edit ID found:", editId);
  let transactionid = editId;
  let transactions = await Transaction.findById(transactionid);
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  if (!token) return [];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let userwithacc = await AboutUser(decoded.userid);
  // console.log("in transaction", userwithacc.user);
  let user = userwithacc.user;
  let accounts = userwithacc.user.accounts;
  // console.log(user, accounts);
  return (
    <>
      <div className="m-5">
        <h1 className=" text-3xl text-primaryText capitalize ">
          create a transaction
        </h1>

        <TransactionForm
          user={user}
          acc={accounts}
          transactions={JSON.parse(JSON.stringify(transactions)) || {}}
        />
      </div>
    </>
  );
};

export default transaction;
