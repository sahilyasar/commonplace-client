import { Suspense } from "react";
import { io } from "next/cache";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import EventsBrowser from "@/components/events/events-browser";
import EventsLoading from "@/components/events/events-loading";

export const metadata = {
  title: "Upcoming Events | Commonplace",
  description: "Discover local volunteer events and community initiatives near you.",
};

async function EventResults() {
  await io();
  let events;

  try {
    const res = await fetch("http://localhost:3001/events", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error("Could not load events.");
    events = await res.json();
    if (!Array.isArray(events)) throw new Error("Expected a list of events.");
  } catch (error) {
    console.error("Loading events failed:", error);
    return <EventsBrowser error="We couldn't load events right now. Please try again." />;
  }

  // Event dates are calendar dates for this Bangladesh community platform.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const upcomingEvents = events
    .filter((event) => event.date && event.date.slice(0, 10) > today)
    .sort((first, second) => first.date.localeCompare(second.date));

  return <EventsBrowser events={upcomingEvents} />;
}

export default function AllEventsPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm pb-12 pt-14 max-md:pb-10 max-md:pt-9">
      <div className="page-container">
        <div className="flex items-center justify-between gap-8">
          <div>
            <p className="inline-flex rounded-full bg-background px-4 py-2.5 text-xs font-bold uppercase max-md:bg-secondary">Future community drives</p>
            <h1 className="mt-4 text-5xl leading-tight tracking-[-0.02em] max-md:mt-5 max-md:text-[38px]">Upcoming Events</h1>
            <p className="mt-3 max-w-[680px] leading-relaxed text-muted-foreground"><span className="max-md:hidden">Discover community initiatives scheduled for future dates. Past events stay out of view so you can focus on active ways to help.</span><span className="md:hidden">Discover local opportunities scheduled for future dates.</span></p>
          </div>
          <Link href="/add-form" className={buttonVariants({ className: "h-13 shrink-0 gap-5 px-6 font-bold max-md:hidden" })}>Create an Event <ArrowRight aria-hidden="true" /></Link>
        </div>

        <Suspense fallback={<EventsLoading />}>
          <EventResults />
        </Suspense>
      </div>
    </main>
  );
}
