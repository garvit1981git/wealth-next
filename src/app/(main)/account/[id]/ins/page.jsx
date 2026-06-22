// "use server"
import AccountWithTransactions from "@/app/actions/AccountWithTransactions";
import Reccuring from "@/components/ui/Reccuring";
import Mongoosedb from "@/lib/mongoose";
import { use } from "react";

let CreateReccuruing = async ({ params }) => {
  await Mongoosedb();
   const { id } = await params
  //  console.log("this is accountId",id)
  let res = await AccountWithTransactions(id);
  console.log("this is res",res.account.Transaction)
  let trans = res.account.Transaction;
  const today = new Date();
  let todayreccuring = trans.filter((t)=>{
  const ReccuringDate = new Date(t.nextRecurringDate);
      let isMatch =
        today.getFullYear() === ReccuringDate.getFullYear() &&
        today.getMonth() === ReccuringDate.getMonth() &&
        today.getDate() === ReccuringDate.getDate();
      return isMatch;

  })

  console.log(todayreccuring)
  return <Reccuring todayreccuring={todayreccuring} ></Reccuring>
};
export default CreateReccuruing;
