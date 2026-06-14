// "use server";
"use server";
import { use } from "react";
import Usercard from "./Usercard.jsx";
import AboutUser from "@/app/actions/AboutUser";

let User = async ({ user }) => {
  console.log("in user server", user);
  // console.log("in user", user);
  let res = await AboutUser(user.userid);
  let resuser = JSON.parse(JSON.stringify(res));
  let dbtheme = resuser?.user?.Theme;

  return <Usercard user={resuser} dbtheme={dbtheme}></Usercard>;
};
export default User;
