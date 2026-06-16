"use client";
import Image from "next/image";
import Link from "next/link";
import naturepic from "../../images/heroimg.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

let HeroSection = () => {
  useGSAP(() => {
    gsap.from(".hero-image", {
      scale: 1.2,
      rotateX: 40, // tilt in 3D
      // transformOrigin: "center center",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".hero-image",
        start: "top 60%",
        end: "bottom 40%",
        scrub: 2,
        // markers: true,
      },
    });
  });

  return (
    <>
      <div className="text-center gap-8 flex flex-col items-center p-6  pt-30 overflow-hidden ">
        <h1 className="md:text-8xl text-2xl capitalize font-extrabold leading-relaxed text-primaryText">
          manage your finances <br />
          with intelligence
        </h1>
        <p className="text-secondaryText p-06 sm:px-20 md:px-40 lg:px-60 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, quae?
          Veritatis doloribus, harum eius exercitationem sapiente ullam
          consequatur quidem, est quo, illo voluptate molestias excepturi
          dolores labore non aut totam ea blanditiis hic tempora ratione facere
          voluptates!
        </p>
        <div className="b  font-medium">
          <button className="bg-accentLight hover:bg-accentLight  p-2 sm:p-3">Get Started</button>

          <Link
            href="https://www.youtube.com/watch?v=ANdLTGWOirI&list=RDANdLTGWOirI&start_radio=1"
            target="_blank"
          >
            <button className="bg-accentLight p-2 hover:bg-accentDark sm:p-3">Watch demo</button>
          </Link>
        </div>
        <div className="image-wrapper " style={{ perspective: "1000px" }}>
          <Image
            src={naturepic}
            width="950"
            height="700"
            alt="nature"
            className="hero-image m-auto object-contain rounded-2xl shadow-2xl shadow-gray-950"
          ></Image>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
