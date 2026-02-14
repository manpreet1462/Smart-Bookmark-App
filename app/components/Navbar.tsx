"use client";

import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setLogoutConfirm(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (!logoutConfirm) {
      setLogoutConfirm(true);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setLogoutConfirm(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-white/90">
            Smart Bookmarks
          </Link>
          <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-lg font-semibold text-white/90 transition-colors hover:text-cyan-400/90"
        >
          Smart Bookmarks
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  pathname === "/bookmarks"
                    ? "text-cyan-400"
                    : "text-white/70 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                Bookmarks
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  logoutConfirm
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "text-white/70 hover:bg-white/5 hover:text-white/90 hover:shadow-[0_0_20px_-8px_rgba(34,211,238,0.3)]"
                }`}
              >
                {logoutConfirm ? "Click again to logout" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  pathname === "/"
                    ? "text-cyan-400"
                    : "text-white/70 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                Home
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.2)]"
              >
                Try free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
