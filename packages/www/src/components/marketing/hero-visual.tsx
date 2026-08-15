export function HeroVisual() {
  return (
    <div className="relative mx-3 overflow-hidden rounded-2xl bg-ink" style={{ height: "clamp(16rem, 28vw, 22rem)" }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,241,234,1) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,234,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute left-[12%] top-[20%] h-24 w-24 rounded-full bg-[#ee4d2d] opacity-80 blur-sm" />
      <div className="absolute right-[18%] top-[30%] h-32 w-32 rounded-full bg-[#a8e5e1] opacity-60 blur-sm" />
      <div className="absolute bottom-[15%] left-[35%] h-20 w-20 rounded-full bg-[#d7f257] opacity-70 blur-sm" />

      {/* Sharp geometric overlays */}
      <div className="absolute left-[8%] top-[35%] h-16 w-48 border border-paper/20" />
      <div className="absolute right-[10%] bottom-[25%] h-24 w-24 border border-paper/20 rotate-12" />
      <div className="absolute left-[50%] top-[15%] h-12 w-64 border border-paper/15 -translate-x-1/2" />

      {/* Connecting lines suggesting data flow */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="15%" y1="50%" x2="40%" y2="35%" stroke="rgba(243,241,234,0.12)" strokeWidth="1" />
        <line x1="40%" y1="35%" x2="65%" y2="55%" stroke="rgba(243,241,234,0.12)" strokeWidth="1" />
        <line x1="65%" y1="55%" x2="85%" y2="40%" stroke="rgba(243,241,234,0.12)" strokeWidth="1" />
        {/* Nodes */}
        <circle cx="15%" cy="50%" r="4" fill="#ee4d2d" />
        <circle cx="40%" cy="35%" r="4" fill="#a8e5e1" />
        <circle cx="65%" cy="55%" r="4" fill="#d7f257" />
        <circle cx="85%" cy="40%" r="4" fill="#ee4d2d" />
      </svg>

      {/* Centre text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-paper/40">
          inbox → extract → enrich → review → book
        </p>
      </div>
    </div>
  );
}
