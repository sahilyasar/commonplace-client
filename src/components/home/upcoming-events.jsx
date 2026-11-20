import { Suspense } from "react";
import { io } from "next/cache";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import EventCard from "@/components/home/event-card";

async function FeaturedEventCards() {
  await io();
  let events;
  try {
    const response = await fetch("http://localhost:3001/featured-events", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Could not load featured events.");
    events = await response.json();
    if (!Array.isArray(events)) throw new Error("Expected a list of events.");
  } catch {
    return <p role="status">Featured events could not be loaded. Please try again later.</p>;
  }

  if (events.length === 0) {
    return <p className="rounded-2xl bg-card px-6 py-12 text-center text-muted-foreground">There are no featured events right now.</p>;
  }

  return (
    <div id="event-cards" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => <EventCard key={event._id || event.id} event={event} />)}
    </div>
  );
}

export default function UpcomingEvents() {
  return (
    <section id="upcoming-events" className="section-space bg-warm">
      <div className="page-container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Featured events</p>
            <h2 className="mt-4 text-[42px] leading-tight max-md:text-3xl">Explore community events</h2>
            <p className="mt-3 text-muted-foreground">Open an event to see the date, meeting point, and organizer.</p>
          </div>
          <Link href="/all-events" className={buttonVariants({ className: "h-13 gap-5 px-6 font-bold max-md:hidden" })}>View all events <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="mt-8">
          <Suspense fallback={<p role="status">Loading featured events…</p>}>
            <FeaturedEventCards />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
