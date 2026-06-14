
import AccountDisplayer from "@/components/ui/AccountDisplayer";
import { use } from "react";


const Account = ({ params }) => {
  const { id } = use(params);

  return <AccountDisplayer accountId={id}></AccountDisplayer>
};

export default Account;
