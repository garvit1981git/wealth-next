"use server"


import User from "../../../models/User";
import Budget from "../../../models/Budget";
import Transaction from "../../../models/Transaction";

let GetUserBudget = async (userid) => {
  // console.log(userid, "this is id")
  let user = await User.findById(userid)
  if (!user) {
    throw new Error("User not found");
  }
  let currentdate = new Date()
  let monthstart = new Date(
    currentdate.getFullYear(),
    currentdate.getMonth(),
    1

  )
  let monthend = new Date(
    currentdate.getFullYear(),
    currentdate.getMonth() + 1,
    0
  )

  // console.log("this is userbudget", user)
  let userwithtransactions = await user.populate("Transaction")
  let usertransactions = userwithtransactions.Transaction
  // let defaultacctransactions = usertransactions.filter((t)=> t.)
  // console.log("all user Transaction", usertransactions)
  let userbudget = await Budget.findById(user.budget)
  let parsedbudget = JSON.parse(JSON.stringify(userbudget));
  let AllExpenseTransactionsOfLastMonth = usertransactions.filter((t) => {
    return t.type == "Expense" && monthend >= new Date(t.date) && new Date(t.date) >= monthstart
  })
  let total = 0
  let totalexpense = AllExpenseTransactionsOfLastMonth.map((at) => {
    return total += at.amount
  })

  return { budgetobjparsed: parsedbudget, totalexpenses: total, }
}
export default GetUserBudget