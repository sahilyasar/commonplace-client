import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import CreateEventButton from "@/components/home/create-event-button";

export default function Hero() {
  return (
    <section className="bg-hero pb-20 pt-[88px] max-lg:py-14 max-md:py-10">
      <div className="page-container">
        <div className="mx-auto max-w-[1040px] text-center">
          <p className="eyebrow lg:mx-auto lg:w-fit lg:rounded-full lg:bg-secondary lg:px-4 lg:py-2 lg:text-foreground"><span className="max-lg:hidden">A new way to show up for your neighborhood</span><span className="lg:hidden">Local community. Real change.</span></p>
          <h1 className="mt-8 text-[68px] leading-[1.12] tracking-[-0.035em] max-lg:text-[54px] max-md:mt-5 max-md:text-[42px] max-sm:text-[38px]">
            Gather for good.<br />Grow where you live.
          </h1>
          <p className="mx-auto mt-8 max-w-[750px] text-lg leading-relaxed text-muted-foreground max-md:mt-5 max-md:text-base"><span className="max-md:hidden">Find meaningful local volunteer events, meet kind people, and turn small actions into stronger communities. Every neighborhood has a part to play.</span><span className="md:hidden">Find volunteer events, meet your neighbors, and make a difference near home.</span></p>
          <div className="mt-7 flex justify-center gap-4 max-sm:flex-col">
            <Link href="/all-events" className={buttonVariants({ className: "h-13 justify-between gap-5 px-6 font-bold" })}>Explore upcoming events <ArrowRight aria-hidden="true" /></Link>
            <CreateEventButton className="h-13 gap-5 border-0 bg-background px-6 font-bold max-lg:hidden" />
          </div>
        </div>
        <div className="mx-auto mt-8 hidden max-w-[1110px] grid-cols-4 gap-4 lg:grid" aria-label="Our community in numbers">
          <div className="stat-card"><p>1,450+</p><span>Active volunteers</span></div>
          <div className="stat-card"><p>180+</p><span>Events completed</span></div>
          <div className="stat-card"><p className="text-coral">24,000+</p><span>Lives impacted</span></div>
          <div className="stat-card"><p>100%</p><span>Community driven</span></div>
        </div>
        <div className="mx-auto mt-8 grid max-w-[1020px] grid-cols-3 gap-4 max-lg:grid-cols-1 max-md:mt-5">
          <Image src="/images/community-hero.jpg" alt="Neighbors planting a young tree together" width={710} height={339} preload sizes="(max-width: 1023px) 100vw, 33vw" className="aspect-[1.75] w-full rounded-2xl object-cover max-lg:aspect-[2.1] max-sm:aspect-[1.5]" />
          <Image src="/images/community-cleanup.jpg" alt="Local volunteers cleaning their shared neighborhood" width={373} height={238} sizes="33vw" className="aspect-[1.75] w-full rounded-2xl object-cover max-lg:hidden" />
          <Image src="/images/community-donation.jpg" alt="Volunteers preparing blankets for a donation drive" width={373} height={238} sizes="33vw" className="aspect-[1.75] w-full rounded-2xl object-cover max-lg:hidden" />
        </div>
      </div>
    </section>
  );
}
