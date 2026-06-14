"use client";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";

let StartTrialSection = () => {
  useGSAP(() => {
    gsap.from(".start", {
      y: 30,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "none",
    });
  });
  return (
    <>
      <div className="p-20 text-white bg-mainBg mt-30 text-center  flex flex-col items-center justify-center gap-5 ">
        <h1 className="capitalize font-bold text-4xl text-primaryText">
          ready to take control of your finance ?
        </h1>
        <div className="text-secondaryText">
          join thousands of users who are already managing their finances
          smarter with Welth
        </div>
        <button className="start p-3 rounded-2xl bg-accentLight hover:scale-90 hover:bg-accentDark text-primaryText font-medium">
          {" "}
          Start free trial
        </button>
      </div>
    </>
  );
};
export default StartTrialSection;
