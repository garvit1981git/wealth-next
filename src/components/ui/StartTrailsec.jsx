"use client";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import UserProviderForPage from "@/lib/UserProviderForPage";
import { redirect } from "next/navigation";
import { useState } from "react";

let StartTrialSection = () => {
  let [res , setres] = useState("")
  useGSAP(() => {
    gsap.from(".start", {
      y: 30,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "none",
    });
  });
  let HandleStart =async ()=>{
let res = await UserProviderForPage()
console.log("this is start res",res)
if (res == null || undefined ){
setres(null)
redirect("/sign-up")

}
else{
setres(res.userid)
  redirect("/dashboard")
}
console.log("this is res",res)
  }
  return (
    <>
      <div className="p-20 text-white bg-mainBg mt-30 text-center  flex flex-col items-center justify-center gap-5 ">
        <h1 className="capitalize font-bold text-4xl text-primaryText">
          ready to take control of your finance ?
          
        </h1>
        <div className="text-secondaryText">
            {res !== null || undefined ? null : 
       " join thousands of users who are already managing their finances smarter with Welth"
          }
         
        </div>
        <button className="start p-3 rounded-2xl bg-accentLight hover:scale-90 hover:bg-accentDark text-primaryText font-medium capitalize"
        onClick={()=>HandleStart()}
        >
          {" "}
          {res !== null || undefined ? "go to dashboard" : 
         " Start free trial"
          }
          
        </button>
      </div>
    </>
  );
};
export default StartTrialSection;
