import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboardpage from "@/components/ui/dashboardpage";
import jwt from "jsonwebtoken";
import Mongoosedb from "@/lib/mongoose";
import User from "../../../../models/User";
import GetUserBudget from "@/app/actions/GetUserBudget";
// import GetUserBudget from "@/app/actions/GetUserBudget";

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  // console.log("this is token", token); D
  // console.log(process.env.JWT_SECRET)
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);  D
  await Mongoosedb();
  let user = await User.findById(decoded.userid).lean();
  const safeUser = JSON.parse(JSON.stringify(user));
  if (!user) {
    console.log("unauthorised");
    redirect("/sign-in");
  }
  if (!token) {
    redirect("/sign-in");
  }
  let acc = user.accounts;
  let res = acc.length > 0 ? await GetUserBudget(user._id) : null;

  // console.log("user is",user) DD
  return (
    <>
      <Dashboardpage user={safeUser} budget={res}></Dashboardpage>
    </>
  );
};

export default Dashboard;
