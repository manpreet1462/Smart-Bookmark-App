import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { LoginCard } from "./LoginCard";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/bookmarks");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0f172a]"
        aria-hidden
      />
      <div
        className="absolute -top-[40%] right-[10%] h-[80vh] w-[80vw] max-w-2xl rounded-full bg-cyan-500/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-[10%] left-[5%] h-[50vh] w-[60vw] max-w-xl rounded-full bg-indigo-500/[0.05] blur-3xl"
        aria-hidden
      />

      <LoginCard>
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white/95">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Sign in to access your bookmarks
            </p>
          </div>
          <GoogleSignInButton />
        </div>
      </LoginCard>
    </div>
  );
}
