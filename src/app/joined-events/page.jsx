import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { ArrowRight } from "lucide-react";
import { auth, db } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import JoinedEventCard from "@/components/events/joined-event-card";

export const metadata = { title: "Joined Events | Commonplace" };

async function Commitments() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  let events = [];
  let message = "";
  try {
    const ids = await db.collection("joined_events").distinct("eventId", { email: session.user.email });
    const eventIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    events = await db.collection("events").find({ _id: { $in: eventIds } }).sort({ date: 1, _id: 1 }).toArray();
    if (!events.length) message = "You haven't joined any events yet. Explore upcoming events to find your first one.";
  } catch {
    message = "Your joined events could not be loaded. Please try again later.";
  }
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

  return (
    <>
      <header className="md:flex md:items-center md:justify-between md:gap-6 md:border-b md:pb-7">
        <div>
          <p className="eyebrow">My volunteer commitments</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">Joined Events</h1>
          <p className="mt-3 text-muted-foreground">Your joined events are listed below. </p>
        </div>
        <Link href="/all-events" className={buttonVariants({ className: "hidden h-12 px-5 font-bold md:inline-flex" })}>Explore More Events</Link>
      </header>
      {message ? (
        <p role="status" className="mt-6 rounded-2xl bg-card p-6">{message}</p>
      ) : (
        <>
          <div className="mt-5 grid max-w-[1156px] gap-5 md:mt-[74px] md:grid-cols-2 md:gap-6">
            {events.map((event) => <JoinedEventCard key={event._id.toString()} event={event} today={today} />)}
          </div>
          {/* <p className="mt-6 hidden rounded-xl bg-secondary p-4 text-sm text-muted-foreground md:block">
            Joined events appear in ascending event-date order and are specific to your account.
          </p> */}
        </>
      )}
      <Link href="/all-events" className={buttonVariants({ className: "mt-5 h-13 w-full justify-between px-5 font-bold md:hidden" })}>
        Explore More Events <ArrowRight aria-hidden="true" />
      </Link>
    </>
  );
}

export default function JoinedEventsPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm">
      <div className="mx-auto max-w-[1236px] px-[18px] pt-9 pb-8 md:pt-14 md:pb-6">
        <Suspense fallback={<p role="status">Loading your joined events…</p>}>
          <Commitments />
        </Suspense>
      </div>
    </main>
  );
}
