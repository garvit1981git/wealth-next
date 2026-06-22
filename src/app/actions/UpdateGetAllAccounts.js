"use server";

import Account from "../../../models/Account";

const UpdateGetAllAccounts = async (accid) => {
  let account = await Account.findById(accid);
  let allacc = await Account.find({ user: account.user });
  return JSON.parse(JSON.stringify(allacc));
};

export default UpdateGetAllAccounts;
