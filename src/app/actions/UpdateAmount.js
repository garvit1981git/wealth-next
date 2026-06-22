"use server";

import Account from "../../../models/Account";
import { SavingsGoal } from "../../../models/SavingsGoal";

let UpdateAmount = async (accid) => {
  let account = await Account.findById(accid);
  let goals = await SavingsGoal.find({ userId: account.user });
  return JSON.parse(JSON.stringify(goals));
};
export default UpdateAmount;
