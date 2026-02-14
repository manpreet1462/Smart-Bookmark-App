"use client";

import { motion } from "framer-motion";

export function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}
