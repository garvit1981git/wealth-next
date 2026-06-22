import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboardpage from "@/components/ui/dashboardpage";
import jwt from "jsonwebtoken";
import Mongoosedb from "@/lib/mongoose";
import User from "../../../../models/User";
import GetUserBudget from "@/app/actions/GetUserBudget";
import GetAllGoalList from "@/app/actions/GetAllGoalList";

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  await Mongoosedb();
  let user = await User.findById(decoded.userid).lean();
  
  if (!user) {
    console.log("unauthorised");
    redirect("/sign-in");
  }

  const safeUser = JSON.parse(JSON.stringify(user));
  
  // 1. Destructure the updated structured response properties safely
  const { goals, completedGoalNames } = await GetAllGoalList(safeUser._id);
  
  let acc = user.accounts;
  let res = acc.length > 0 ? await GetUserBudget(user._id) : null;

  return (
    <>
      {/* 2. Forward the target arrays directly into your Client page structure */}
      <Dashboardpage 
        user={safeUser} 
        budget={res} 
        goals={goals} 
        completedGoalNames={completedGoalNames}
      />
    </>
  );
};

export default Dashboard;