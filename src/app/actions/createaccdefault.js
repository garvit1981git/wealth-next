"use server"

import Mongoosedb from "@/lib/mongoose";
import Account from "../../../models/Account";
let CreateAccountDef = async (accid) => {
  await Mongoosedb();
  let clickedAcc = await Account.findById(accid)
  let user = await clickedAcc.user
  // console.log(user)
  let alluseracc = await Account.find({ user: user })
  if (!clickedAcc.isDefault) {
    // set all accounts to false
    await Account.updateMany({ user }, { $set: { isDefault: false } });

    // set clicked account to true
    await Account.updateOne(
      { _id: accid },
      { $set: { isDefault: true } }
    );
  }
}
export default CreateAccountDef