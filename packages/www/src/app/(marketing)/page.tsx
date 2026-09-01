import { DemoForm } from "@/components/marketing/demo-form";
import { FeatureTabs } from "@/components/marketing/feature-tabs";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { ProcessSection } from "@/components/marketing/process-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center px-[clamp(1.25rem,4vw,4.75rem)] py-[clamp(4rem,10vh,8rem)] text-center">
        <p className="mb-8 font-mono text-[0.7rem] uppercase">
          The all-in-one booking platform
        </p>
        <h1 className="mb-6 max-w-[700px] text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-tight">
          Manage every booking,
          <br />
          <span className="text-muted-foreground">offer to settlement.</span>
        </h1>
        <p className="mb-10 max-w-[38rem] text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed">
          Overbook empowers music booking agencies to move at the speed of AI —
          from inbound offer to confirmed show.
        </p>
        <DemoForm />
      </section>

      <HeroVisual />

      <FeatureTabs />

      <ProcessSection />
    </div>
  );
}
