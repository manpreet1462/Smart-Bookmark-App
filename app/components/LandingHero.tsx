"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-4xl font-bold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
      >
        Save. Organize.{" "}
        <span className="bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
          Access anywhere.
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-6 text-lg text-white/60 sm:text-xl"
      >
        Smart Bookmark App keeps your links in one place. Sign in with Google and
        manage your bookmarks across devices—with real-time sync.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/login"
          className="rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-6 py-3.5 text-base font-medium text-cyan-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.25)] transition-all duration-200 hover:border-cyan-500/60 hover:bg-cyan-500/25 hover:shadow-[0_0_32px_-4px_rgba(34,211,238,0.35)]"
        >
          Try it free
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-medium text-white/80 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
        >
          View demo
        </Link>
      </motion.div>
    </div>
  );
}
