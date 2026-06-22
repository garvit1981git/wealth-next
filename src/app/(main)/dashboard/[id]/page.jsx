"use server"

import GetUserAccounts from "@/app/actions/GetUserAccounts";
import CreateGoalPage from "@/components/ui/CraeteGoalPage";
// import CraeteGoalPage from "@componet"

const CreateGoal = async ({ params }) => {
  const { id } = await params;
  let res = await GetUserAccounts();
  console.log("this is res", res);
  return <>
  
  <CreateGoalPage acc={res}></CreateGoalPage>
  </>
  
};

export default CreateGoal;
