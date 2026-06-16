"use server"
import Mongoosedb from "@/lib/mongoose"
import Account from "../../../models/Account"
import Transaction from "../../../models/Transaction"


let GetTransactionsOfSelectedAcc = async (userid, acc) => { 
await Mongoosedb()
let account = await Account.find({user: userid, accountname: acc}).populate("Transaction")

let transactions = account[0]?.Transaction

let exptransactions = transactions?.filter((t) => {
  return t.type == "Expense"
}) || []
return JSON.parse(JSON.stringify(exptransactions));
}

export default GetTransactionsOfSelectedAcc ;