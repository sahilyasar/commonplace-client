import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import ManagedEventCard from "@/components/events/managed-event-card";

export const metadata = { title: "Manage My Events | Commonplace" };

async function OrganizerDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) redirect("/login");

  let events = [];
  let message = "";
  try {
    const email = encodeURIComponent(session.user.email);
    const response = await fetch(`http://localhost:3001/my-events/${email}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Could not load events");
    const records = await response.json();
    events = records.filter((event) => event.email === session.user.email);
    if (!events.length) message = "You haven’t published any events yet.";
  } catch {
    message = "Your events could not be loaded. Please try again later.";
  }

  return (
    <>
      <header className="md:flex md:items-center md:justify-between md:gap-6 md:border-b md:pb-7">
        <div>
          <p className="eyebrow">Organizer dashboard</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">Manage My Events</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            <span className="hidden md:inline">View, edit and manage events you have published. </span>
            Choose an event below to view or manage its details.
          </p>
        </div>
        <Link href="/add-form" className={buttonVariants({ className: "mt-5 h-13 w-full justify-between px-5 font-bold md:mt-0 md:h-12 md:w-auto" })}>
          Create New Event <ArrowRight className="md:hidden" aria-hidden="true" />
        </Link>
      </header>
      {message ? (
        <p role="status" className="mt-6 rounded-2xl bg-card p-6 md:mt-16">{message}</p>
      ) : (
        <>
          <div className="mt-5 grid max-w-[1156px] gap-5 md:mt-[74px] md:grid-cols-2 md:gap-6">
            {events.map((event) => <ManagedEventCard key={event._id} event={event} />)}
          </div>
          <p className="mt-6 text-sm text-muted-foreground md:rounded-xl md:bg-secondary md:p-4">
            You’ll be asked to confirm before an event is permanently deleted.
          </p>
        </>
      )}
    </>
  );
}

export default function MyEventsPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm">
      <div className="mx-auto max-w-[1236px] px-[18px] pt-9 pb-8 md:pt-14 md:pb-6">
        <Suspense fallback={<p role="status">Loading your events…</p>}>
          <OrganizerDashboard />
        </Suspense>
      </div>
    </main>
  );
}
