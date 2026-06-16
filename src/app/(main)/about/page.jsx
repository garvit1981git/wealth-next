import React from "react";
import * as Icons from "lucide-react";
import Link from "next/link";

const About = () => {
  // Core platform features array


  return (
    <div className="min-h-screen bg-[var(--mainBg)] text-[var(--thePrimaryText)] font-sans selection:bg-[var(--accent-light)] selection:text-white transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:px-8 border-b border-[var(--card-border)] bg-[var(--purebg)]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent-light)]/10 text-[var(--accent-light)] mb-6 border border-[var(--accent-light)]/20">
            About Wealth
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-[var(--thePrimaryText)]">
            Take absolute control over your{" "}
            <span className="text-[var(--accent-light)]">financial vector</span>
            .
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--theSecondaryText)] max-w-xl mx-auto">
            Wealth is a highly responsive, streamlined personal finance
            infrastructure built to monitor accounts, map granular transaction
            pipelines, and automate budget strategies.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard">
              <button className="rounded-xl bg-[var(--accent-light)] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--accent-dark)] transition-all duration-150 flex items-center gap-2 group">
                Enter Dashboard
                <Icons.ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </Link>
          </div>
        </div>
      </section>

    
      {/* 3. PLATFORM STATISTICS INTENT BLOCK */}
      

      {/* 4. FOOTER CLOSING CALL TO ACTION */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--thePrimaryText)] sm:text-4xl">
          Ready to stabilize your monthly runway?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--theSecondaryText)]">
          Join a robust financial system designed to eliminate transactional
          noise and amplify clarity.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/transaction/create">
            <button className="rounded-xl border border-[var(--card-border)] bg-[var(--mainBg)] px-6 py-3 text-sm font-semibold text-[var(--thePrimaryText)] shadow-sm hover:bg-[var(--purebg)] transition-all">
              Log Transaction
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
