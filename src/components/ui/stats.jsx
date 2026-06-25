"use client";
import { statsData } from "../../../data/landingpagedata.js";
let Stats = () => {
  // console.log(statsData);
  // statsData.map((elem) => {
  //   console.log(elem.value);
  //   console.log(elem.label);
  // });
  return (
    <>
      <div className="stats bg-pureBg border border-cardBorder  flex justify-between  p-3 capitalize text-center relative w-full max-h-[10%]  shadow-2xl ">
        {statsData.map((elem, index) => (
          <div className="indivstat text-center p-2 " key={index}>
            <h1 className="md:text-2xl sm:text-sm text-xs font-extrabold  text-primaryText m-2">
              {elem.value}
            </h1>
            <h1 className="sm:text-sm text-[10px] text-secondaryText">{elem.label}</h1>
          </div>
        ))}
      </div>
    </>
  );
};
export default Stats;
