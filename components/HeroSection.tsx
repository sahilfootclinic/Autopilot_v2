"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Crown,
  X,
} from "lucide-react";

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ["Projects", "Studio", "Offerings", "Inquire"];
  const stats = [
    { value: "250+", label: "Portfolios Tracked" },
    { value: "95%", label: "Data Accuracy" },
    { value: "10+", label: "Years Operating" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navbar */}
      <nav className="relative z-40 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        {/* Brand */}
        <div className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
          Sentinel
        </div>

        {/* Center nav links - hidden below md */}
        <div className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs uppercase tracking-widest text-white/80 transition hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Desktop CTA button - hidden below md */}
          <a
            href="#"
            className="hidden items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:border-white/60 hover:bg-white/10 md:flex"
          >
            Learn More
            <ArrowUpRight className="h-3 w-3" />
          </a>

          {/* Mobile hamburger - visible below md */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="h-0.5 w-6 bg-white" />
            <div className="h-0.5 w-6 bg-white" />
            <div className="h-0.5 w-4 bg-white" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/95 backdrop-blur-sm transition-all duration-500 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
            Sentinel
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu links */}
        <div className="flex flex-col items-center justify-center gap-8 py-20">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl uppercase text-white transition sm:text-5xl"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out ${(i * 80 + 100) / 1000}s, transform 0.5s ease-out ${(i * 80 + 100) / 1000}s`,
              }}
            >
              {link}
            </a>
          ))}

          {/* Mobile CTA button */}
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:border-white/60 hover:bg-white/10"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s`,
            }}
          >
            Learn More
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 sm:px-10 lg:px-16">
        {/* Tagline */}
        <div className="mb-6 flex items-center gap-3 lg:mb-8">
          <Crown className="h-4 w-4 text-white/70" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            World-Class Intelligence Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-up-delay-1 font-podium uppercase leading-[0.92] tracking-tight text-white">
          <div className="text-[clamp(2.8rem,8vw,7rem)]">Follow</div>
          <div className="text-[clamp(2.8rem,8vw,7rem)]">The Money.</div>
          <div className="text-[clamp(2.8rem,8vw,7rem)]">Track Power.</div>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up-delay-2 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
          We surface hidden patterns in elite portfolios
          <br />
          so you can make smarter decisions.{" "}
          <span className="text-white">Institutional-grade intelligence</span>.
        </p>

        {/* CTA Row */}
        <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
          {/* Black button */}
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-black px-5 py-3 text-[11px] uppercase tracking-widest text-white transition hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
          >
            Start Exploring
            <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
          </a>

          {/* Award badge - hidden on mobile */}
          <div className="hidden items-center gap-3 sm:flex">
            <Award className="h-8 w-8 text-white/50" />
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Trusted By
              </div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Top Investors
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
