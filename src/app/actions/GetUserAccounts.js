// app/actions/getUserAccounts.js
"use server";

import Mongoosedb from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "../../../models/User";
import Account from "../../../models/Account";
let GetUserAccounts = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  if (!token) return [];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await Mongoosedb();

  const user = await User.findById(decoded.userid);

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch accounts for this user
  const accounts = await Account.find({ user: user._id }).lean();
  const plainAccounts = accounts.map(acc => ({
    id: acc._id.toString(),
    accountname: acc.accountname,
    type: acc.type,
    balance: acc.balance.toString(),               // convert Decimal128 to string
    isDefault: acc.isDefault,
    user: acc.user.toString(),                     // convert ObjectId
    Transaction: acc.Transaction.map(t => t.toString()), // convert ObjectIds
  }));
  // console.log(accounts)
  // console.log(plainAccounts)
  // if (!user) return [];
  return plainAccounts;
};

export default GetUserAccounts;