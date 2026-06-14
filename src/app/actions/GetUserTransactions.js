"use server";

import Mongoosedb from "@/lib/mongoose";
import User from "../../../models/User";
import Account from "../../../models/Account";

let GetUserTransactions = async (userid) => {
  await Mongoosedb();
  let account = await Account.findOne({ user: userid }).populate("Transaction");
  console.log("account at get user transactions is ", account);
  let user = await User.findById(userid).populate("Transaction");
  let usertransactions = user.Transaction;
  let exptransactions = usertransactions.filter((t) => {
    return t.type == "Expense";
  });
  return JSON.parse(JSON.stringify(exptransactions));
};
export default GetUserTransactions;
