export default function UnderDevelopment() {
  return (
    <main className="min-h-screen bg-[#0f6a3c] flex items-center justify-center px-6 py-10">
      <section className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#07090f] px-6 py-16 text-center shadow-2xl sm:px-10">
        <div className="pointer-events-none absolute left-1/2 top-6 h-44 w-40 -translate-x-1/2 rounded-2xl bg-[#b39ddb]/80 blur-[18px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
        <div className="relative">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">Coming Soon</h1>
          <p className="mt-2 text-sm text-white/80 sm:text-base">Something awesome is on the way!</p>
          <p className="mt-10 text-base text-white/90">This website is currently under development.</p>
          <p className="mt-1 text-base text-white/90">Please check back soon.</p>
          <button
            type="button"
            className="mt-10 rounded-lg bg-[#b39ddb] px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#c3afe3]"
          >
            Notify Me
          </button>
        </div>
      </section>
    </main>
  );
}
