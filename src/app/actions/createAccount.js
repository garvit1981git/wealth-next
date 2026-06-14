"use server"

import Mongoosedb from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "../../../models/User";
import Account from "../../../models/Account";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

let CreateAccount = async (data) => {
  // console.log("this is acc data", data)
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("this is decoded", decoded);
  await Mongoosedb();
  let cuser = await User.findById(decoded.userid)
  let user = await User.findById(decoded.userid).populate("accounts")
  // console.log(user)
  if (!user) {
    redirect("/sign-in")
  }
  let existingaccounts = user.accounts.length > 0 ? true : false
  let isDefaultFlag = data.isDefault === "true" || data.isDefault === true;
  // console.log(existingaccounts)
  let defo = existingaccounts ? isDefaultFlag : true;
  let allexistingaccountsdb = await Account.find({ user: cuser._id })
  if (defo) {
    await Account.updateMany(
      { user: cuser._id },
      { $set: { isDefault: false } }
    );
  }
  let newaccount = await new Account({
    accountname: data.accountname,
    type: data.type,
    balance: data.balance,
    isDefault: defo,
    user: user._id
  })
  await newaccount.save()
  // console.log(newaccount)
  user.accounts.push(newaccount)
  await user.save()
  revalidatePath("/dashboard");
}
export default CreateAccount;