"use client";

import Image from "next/image";
import Link from "next/link";
import naturepic from "../../images/heroimg.png";
import bgimg from "../../images/bgimg1.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Stats from "./stats";

gsap.registerPlugin(ScrollTrigger);

let HeroSection = () => {
  useGSAP(() => {
    gsap.from(".hero-image", {
      scale: 1.1,
      rotateX: 40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".image-wrapper",
        start: "top 80%",
        end: "bottom 40%",
        scrub: 2,
      },
    });
  });

  return (
    <section className="relative w-full flex flex-col items-center text-center px-4 pt-28 sm:pt-32 pb-24 overflow-hidden gap-12 sm:gap-16 transition-colors duration-300">
      {/* BASE BG */}
      <div className="absolute inset-0 bg-pureBg z-0 pointer-events-none" />

      {/* BUILDING IMAGE — height controlled per breakpoint */}
      <div className="absolute top-0 left-0 right-0 w-full h-[600px] z-[1] pointer-events-none">
        <Image
          src={bgimg}
          alt=""
          fill
          priority
          className="object-cover object-top w-full"
        />
        {/* Fade overlay — theme-aware */}
        <div
          className="absolute inset-0 bg-gradient-to-b
          from-[#eef0ff]/50 via-[#f0f1ff]/75 to-[#f0f1ff]
          dark:from-[#0a0a14]/35 dark:via-[#0a0a14]/70 dark:to-[#0a0a14]"
        />
        {/* Tint layer */}
        <div className="absolute inset-0 bg-indigo-100/30 dark:bg-indigo-950/50 mix-blend-multiply" />
      </div>

      {/* RADIAL GLOW */}
      <div
        className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2
        w-[300px] sm:w-[480px] lg:w-[600px]
        h-[180px] sm:h-[240px] lg:h-[300px]
        bg-indigo-400/10 dark:bg-indigo-500/15
        blur-3xl rounded-full z-[2] pointer-events-none"
      />

      {/* HERO TEXT */}
      <div className="max-w-3xl relative flex flex-col items-center gap-5 sm:gap-6 z-10">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-indigo-300/50 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Intelligent Finance Platform
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Manage Your Finances <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
            With Intelligence
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Track spending, forecast budgets, and gain real-time insights — all in
          one beautifully crafted dashboard built for clarity and control.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 sm:gap-4 mt-2">
          <Link
            href="/sign-up"
            className="bg-accentLight hover:bg-accentDark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Get Started
          </Link>
          <Link
            href="/demo"
            className="bg-accentLight hover:bg-accentDark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Watch Demo
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="w-full relative z-10 -bottom-10 sm:-bottom-24 md:-bottom-0">
        <Stats />
      </div>

      {/* 3D HERO IMAGE */}
      <div
        className="image-wrapper -bottom-20 shrink-0 relative z-10"
        style={{ perspective: "900px" }}
      >
        <Image
          src={naturepic}
          width={950}
          height={700}
          alt="Dashboard preview"
          className="hero-image mx-auto w-full h-auto object-contain rounded-2xl shadow-2xl border border-cardBorder"
        />
      </div>
    </section>
  );
};

export default HeroSection;
