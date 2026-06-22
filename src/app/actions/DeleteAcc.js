"use server";

import Mongoosedb from "@/lib/mongoose";
// import Account from "../../../models/Account";
import Account from "../../../models/Account";
import { redirect } from "next/navigation";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";
import { revalidatePath } from "next/cache";

let DeleteAcc = async (Accid) => {
  await Mongoosedb();
  let acc = await Account.findById(Accid);
  // 1. REMOVE the account ID from the User's accounts array (Don't delete the user!)
  await User.updateOne({ _id: acc.user }, { $pull: { accounts: Accid } });

  // 2. DELETE all transactions where their accountId array CONTAINS this Accid
  await Transaction.deleteMany({
    accountId: { $in: [Accid] },
  });

  // 3. DELETE the account document itself
  await Account.findByIdAndDelete(Accid);

  // 4. Refresh the page data and redirect
  revalidatePath("/dashboard");
  // redirect("/dashboard");
  return true;
};
export default DeleteAcc;
