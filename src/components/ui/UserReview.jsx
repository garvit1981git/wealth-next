"use client";

import { useEffect, useRef, useState } from "react";
import { testimonialsData } from "../../../data/landingpagedata.js";

const Testimonials = () => {
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Auto-scroll loop interval
    const autoScroll = setInterval(() => {
      if (isHovered) return; // Pause scrolling if the user is touching/hovering

      const cardWidth = container.clientWidth * 0.8; // Match width factor of mobile card width
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Loop back to start if we reached the end line boundary
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500); // Transitions every 3.5 seconds

    return () => clearInterval(autoScroll);
  }, [isHovered]);

  return (
    <div className="mt-20 p-6 text-center">
      <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-16 text-primaryText transition-colors duration-300">
        What Our Users Say
      </h1>

      {/* On Mobile: Horizontal layout with snap scrolling endpoints 
        On Desktop (sm:): Automatic transition into a standard responsive grid layout
      */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="CardsHolder flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent sm:grid sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
      >
        {testimonialsData.map((elem, i) => (
          <div
            key={i}
            className="card flex-none w-[85%] sm:w-full snap-center border border-gray-200 dark:border-cardBorder rounded-3xl p-8 bg-mainBg shadow-sm hover:shadow-lg transition-all duration-300 max-w-sm flex flex-col justify-between text-left"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={elem.image}
                alt={elem.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-cardBorder"
              />
              <div>
                <h1 className="font-semibold text-xl text-primaryText">
                  {elem.name}
                </h1>
                <p className="text-secondaryText text-sm">{elem.role}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="desc text-secondaryText text-base italic leading-relaxed">
              “{elem.quote}”
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;