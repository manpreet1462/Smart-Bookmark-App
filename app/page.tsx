import { LandingHero } from "@/app/components/LandingHero";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <div
        className="absolute inset-0 bg-linear-to-br from-[#0a0a0f] via-[#0d1117] to-[#0f172a]"
        aria-hidden
      />
      <div
        className="absolute -top-[30%] right-[5%] h-[70vh] w-[70vw] max-w-2xl rounded-full bg-cyan-500/6 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-[20%] left-[10%] h-[40vh] w-[50vw] max-w-xl rounded-full bg-indigo-500/6 blur-3xl"
        aria-hidden
      />

      <main className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-16">
        <LandingHero />
      </main>
    </div>
  );
}
