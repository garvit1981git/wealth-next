import { testimonialsData } from "../../../data/landingpagedata.js";

const Testimonials = () => {
  return (
    <div className="mt-20  p-6  text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-16   text-primaryText">
        What Our Users Say
      </h1>

      <div className="CardsHolder grid gap-10 sm:grid-cols-2 lg:grid-cols-3  justify-items-center">
        {testimonialsData.map((elem, i) => (
          <div
            key={i}
            className="card border border-gray-200 rounded-3xl p-8 bg-mainBg shadow-sm hover:shadow-lg transition-all duration-300 max-w-sm w-full flex flex-col justify-between"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={elem.image}
                alt={elem.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="text-left">
                <h1 className="font-semibold text-xl text-primaryText">
                  {elem.name}
                </h1>
                <p className="text-secondaryText text-sm">{elem.role}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="desc text-secondaryText text-base italic text-left leading-relaxed">
              “{elem.quote}”
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
