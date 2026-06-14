"use server"

import Mongoosedb from "@/lib/mongoose"
import User from "../../../models/User"

let GetAllUsers =async  () => {
  await Mongoosedb()
  let users = await User.find()
  return users
}
export default GetAllUsers