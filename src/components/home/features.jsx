import { features } from "@/data/home";

export default function Features() {
  return (
    <section id="how-it-works" className="section-space bg-background">
      <div className="page-container">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Volunteer or host an event</h2>
          <p className="section-description max-lg:hidden">Start with a cause you care about and a date that works for you.</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-5 lg:grid-cols-4 max-sm:gap-4">
          {features.map((feature, index) => (
            <article key={feature.title} className="min-h-[260px] rounded-[20px] bg-feature p-6 max-lg:min-h-[175px] max-sm:px-4 max-sm:py-5">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="mt-6 text-[23px] leading-tight max-sm:mt-3 max-sm:text-lg">{feature.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-sm:mt-3">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
