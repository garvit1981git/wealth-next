import { featuresData } from "../../../data/landingpagedata.js";

const Features = () => {
  return (
    <div className="mt-30 px-4 sm:px-10 lg:px-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-20">
        Everything you need to manage your finances
      </h1>

      <div className="CardsHolder grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 justify-items-center">
        {featuresData.map((elem, i) => (
          <div
            key={i}
            className="card  rounded-3xl p-10 text-xl flex flex-col items-center bg-mainBg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto max-w-sm"
          >
            <div className="icon mb-4  text-5xl">{elem.icon}</div>
            <div className="title mb-2">
              <h1 className="font-semibold text-2xl text-primaryText">
                {elem.title}
              </h1>
            </div>
            <div className="desc text-secondaryText text-lg text-center">
              {elem.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
