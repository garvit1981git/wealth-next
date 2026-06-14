"use server"

import Mongoosedb from "@/lib/mongoose";
import { cookies } from "next/headers";
import User from "../../../models/User";
import Account from "../../../models/Account";
import Transaction from "../../../models/Transaction"
import jwt from "jsonwebtoken";

let AccountWithTransactions = async (accountId) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  if (!token) return [];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await Mongoosedb();

  const user = await User.findById(decoded.userid);
  // console.log("account is ==", accountId)
  if (!user) {
    throw new Error("User not found");
  }
  let accwithtransactions = await Account.findById(accountId).populate("Transaction")

  let accwithtransactionsParsed = JSON.parse(JSON.stringify(accwithtransactions));
  // console.log("acc on server", accwithtransactions)
  return { account: accwithtransactionsParsed }
}
export default AccountWithTransactions