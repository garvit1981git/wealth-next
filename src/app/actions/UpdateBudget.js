"use server"

import Mongoosedb from "@/lib/mongoose"
import Budget from "../../../models/Budget"
import mongoose from "mongoose"

let UpdateBudget = async (budid, bdgamt) => {
  await Mongoosedb()
  let budget = await Budget.findById(budid)
  if (!budget) throw new Error("Budget not found")
  budget.Amount = mongoose.Types.Decimal128.fromString(
    bdgamt.toString()
  )
  await budget.save()
  return { success: true }
}
export default UpdateBudget