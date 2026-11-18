import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import EventCard from "@/components/home/event-card";

export default function UpcomingEvents({ events = [] }) {
  return (
    <section id="upcoming-events" className="section-space bg-warm">
      <div className="page-container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Upcoming initiatives</p>
            <h2 className="mt-4 text-[42px] leading-tight max-md:text-3xl">Find the good happening nearby.</h2>
            <p className="mt-3 text-muted-foreground">Find your next opportunity to show up for your community.</p>
          </div>
          <Link href="/all-events" className={buttonVariants({ className: "h-13 gap-5 px-6 font-bold max-md:hidden" })}>View all events <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div id="event-cards" className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => <EventCard key={event._id || event.id} event={event} />)}
        </div>
        {events.length === 0 && (
          <p className="rounded-2xl bg-card px-6 py-12 text-center text-muted-foreground">Upcoming events will appear here.</p>
        )}
      </div>
    </section>
  );
}
