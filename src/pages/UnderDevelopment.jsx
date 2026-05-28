export default function UnderDevelopment() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/day.jpg")' }}
    >
      <section className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black/55 px-6 py-20 text-center shadow-2xl backdrop-blur-[2px] sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-36 -translate-x-1/2 rounded-2xl bg-[#b39ddb]/40 blur-[22px]" />
        <div className="relative">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">Coming Soon</h1>
          <p className="mt-3 text-sm text-white/90 sm:text-base">Our livestock and farm experience is almost ready.</p>
          <p className="mt-10 text-base text-white/95">This website is currently under development.</p>
          <p className="mt-1 text-base text-white/95">Please check back soon.</p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white">
            <span className="relative inline-flex h-7 w-7 items-center justify-center" aria-hidden>
              <span className="absolute inset-0 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              <span className="text-sm">🥚</span>
            </span>
            <span>Loading...</span>
          </div>
        </div>
      </section>
    </main>
  );
}
