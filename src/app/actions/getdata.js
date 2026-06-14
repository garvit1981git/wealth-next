"use server"

import Mongoosedb from "@/lib/mongoose";
import User from "../../../models/User";
import Account from "../../../models/Account";

let getdata = async (userid, defaccname) => {
  await Mongoosedb();
    let user = await User.findById(userid).populate("accounts")
    let useraccs = user.accounts
    if (!useraccs) return []
    console.log("user is", userid)
    if (!useraccs || useraccs.length === 0) return []
  if (!defaccname || defaccname == "") {
    let defacc = useraccs.filter((a) => a.isDefault)
    let acc = await Account.findById(defacc[0]._id).populate("Transaction")
    let defacctransactions = acc.Transaction
    if (defacctransactions.length == 0 || !defacctransactions) return []
    let recent = defacctransactions.slice(-7)
    let recentpayments = JSON.parse(JSON.stringify(recent))
    return recentpayments
  }
    let defacc = useraccs.filter((a) => a.accountname == defaccname )
    let acc = await Account.findById(defacc[0]._id).populate("Transaction")
    let defacctransactions = acc.Transaction
    if (defacctransactions.length == 0 || !defacctransactions) return []
    let recent = defacctransactions.slice(-7)
    let recentpayments = JSON.parse(JSON.stringify(recent))
    return recentpayments
   

}
export default getdata