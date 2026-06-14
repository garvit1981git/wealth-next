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
      <div className="stats flex gap-10 justify-between bg-mainBg p-10 capitalize text-center">
        {statsData.map((elem, index) => (
          <div className="indivstat text-center p-2 " key={index}>
            <h1 className="text-4xl font-extrabold text-primaryText m-2">
              {elem.value}
            </h1>
            <h1 className="text-secondaryText">{elem.label}</h1>
          </div>
        ))}
      </div>
    </>
  );
};
export default Stats;
