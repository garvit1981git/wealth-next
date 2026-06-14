import Mongoosedb from "@/lib/mongoose";
import User from "../../../models/User";
import Budget from "../../../models/Budget";
import Accounts from "../../../models/Account";

let AboutUser = async (userid) => {
  await Mongoosedb();
  let user = await User.findById(userid)
    .populate("accounts")
    .populate("budget");
  if (!user) {
    console.log("unauthorised");
  }
  return { user: JSON.parse(JSON.stringify(user)) };
};
export default AboutUser;
