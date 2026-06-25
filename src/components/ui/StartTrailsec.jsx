"use client";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import UserProviderForPage from "@/lib/UserProviderForPage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

let StartTrialSection = async () => {
  let [res, setres] = useState(null);
  // useGSAP(() => {
  //   gsap.from(".start", {
  //     y: 30,
  //     duration: 1,
  //     repeat: -1,
  //     yoyo: true,
  //     ease: "none",
  //   });
  // });
  useEffect(() => {
    let start = async () => {
      let res = await UserProviderForPage();
      console.log("this is start res", res);
      if (res) {
        setres(res.userid);
      }
    };
    start()
  },[]);

  return (
    <>
      <div className="p-20 text-white bg-mainBg mt-30 text-center  flex flex-col items-center justify-center gap-5 ">
        <h1 className="capitalize font-bold text-4xl text-primaryText">
          ready to take control of your finance ?
        </h1>
        <div className="text-secondaryText">
          {res !== null
            ? null
            : " join thousands of users who are already managing their finances smarter with Welth"}
        </div>
        <div
          className="start p-3 rounded-2xl bg-accentLight hover:scale-90 hover:bg-accentDark text-primaryText font-medium capitalize"
       
        >
          {" "}
          {res == null || undefined ? (
            <>
              <Link href="/sign-Up">Start free trial</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">go to dashboard</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default StartTrialSection;
