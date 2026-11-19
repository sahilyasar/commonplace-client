import { Suspense } from "react";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventDetails from "@/components/events/event-details";
import EventDetailsLoading from "@/components/events/event-details-loading";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Event Details | Commonplace",
  description: "Discover a local community initiative and find out how to get involved.",
};

async function EventContent({ params }) {
  await io();
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) notFound();

  let event;
  try {
    const res = await fetch(`http://localhost:3001/event/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (res.status !== 404) {
      if (!res.ok) throw new Error("Could not load the event.");
      const body = await res.text();
      event = body.trim() ? JSON.parse(body) : null;
    }
  } catch (error) {
    console.error("Loading event details failed:", error);
    return (
      <section className="rounded-2xl bg-card px-6 py-16 text-center" role="alert">
        <h1 className="text-3xl">We could not load this event.</h1>
        <p className="mt-4 text-muted-foreground">Please try again in a moment, or explore another community initiative.</p>
        <Link href="/all-events" className={buttonVariants({ className: "mt-6 h-12 px-5" })}>Browse upcoming events</Link>
      </section>
    );
  }

  if (!event || !event._id) notFound();
  return <EventDetails event={event} />;
}

export default function EventDetailsPage({ params }) {
  return (
    <main id="main-content" className="flex-1 bg-warm pb-16 pt-8 max-md:pb-10">
      <div className="page-container">
        <Link href="/all-events" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground max-md:mb-6">
          <ArrowLeft className="size-4" aria-hidden="true" />Back to Upcoming Events
        </Link>
        <Suspense fallback={<EventDetailsLoading />}>
          <EventContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
