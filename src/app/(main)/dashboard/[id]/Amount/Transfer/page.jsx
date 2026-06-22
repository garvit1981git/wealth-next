// "use server"

import AmountTransfer from "@/components/ui/AmountTransfer";
import UpdateGetAllAccounts from "@/app/actions/UpdateGetAllAccounts";

const page = async ({params}) => {
   const { id } = await params;
   console.log("this is id",id) 
      let allAcc = await UpdateGetAllAccounts(id);
  return <><AmountTransfer allAcc={allAcc} id={id}></AmountTransfer> </>
}

export default page
