import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
import EventActions from "@/components/events/event-actions";
import { headers } from "next/headers";
import { auth, db } from "@/lib/auth";

export default async function EventDetails({ event }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const membership = session?.user && await db.collection("joined_events").findOne({
    email: session.user.email, eventId: event._id,
  }, { projection: { _id: 1 } });
  const date = new Date(event.date);
  const dateIsValid = !Number.isNaN(date.getTime());
  const shortDate = dateIsValid ? new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).format(date) : event.date;
  const longDate = dateIsValid ? new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "2-digit", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date) : event.date;

  return (
    <>
      <section aria-label="Event overview">
        <div className="mb-6 md:hidden">
          <p className="inline-flex rounded-full bg-secondary px-4 py-2.5 text-xs font-bold uppercase">{event.type} / {shortDate}</p>
          <h1 className="mt-5 text-[38px] leading-[1.12] tracking-[-0.02em]">{event.title}</h1>
        </div>

        <div className="relative overflow-hidden rounded-[22px]">
          <Image src={event.thumbnailUrl} alt={event.title} width={1220} height={440} unoptimized preload className="h-[440px] w-full object-cover max-lg:h-[380px] max-md:h-[270px] max-sm:h-[250px]" />
          <div className="absolute left-8 top-7 flex flex-wrap gap-3 max-md:hidden">
            <span className="rounded-full bg-secondary px-4 py-3 text-xs uppercase">{event.type}</span>
            <span className="rounded-full bg-secondary px-4 py-3 text-xs uppercase">{longDate}</span>
          </div>
          <div className="absolute bottom-7 left-8 right-24 rounded-[20px] bg-forest p-7 text-white max-lg:right-8 max-md:hidden">
            <h1 className="text-5xl leading-tight tracking-[-0.02em]">{event.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/90"><MapPin className="size-4 shrink-0" aria-hidden="true" />{event.location}</p>
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground md:hidden"><MapPin className="size-4 shrink-0" aria-hidden="true" />{event.location}</p>
      </section>

      <EventActions eventId={event._id} signedIn={Boolean(session?.user)} joined={Boolean(membership)} />

      <div className="mt-16 grid items-start gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] max-lg:gap-8 max-md:mt-7">
        <section aria-labelledby="about-event-heading">
          <p className="eyebrow">About this social initiative</p>
          <h2 id="about-event-heading" className="mt-5 text-[34px] leading-tight max-md:text-3xl">Make a difference, together.</h2>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground">{event.description}</p>

          <div className="mt-6 border-t border-border pt-5 max-md:rounded-2xl max-md:border-0 max-md:bg-secondary max-md:p-5">
            <h3 className="text-2xl">Volunteer guidelines</h3>
            <ul className="mt-4 list-inside list-disc space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li>Confirm the meeting time and location with your organizer.</li>
              <li>Wear comfortable clothing suitable for the activities.</li>
              <li>Bring drinking water and any supplies requested by the organizer.</li>
              <li>Follow organizer guidance and respect the local community.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-secondary p-7 max-md:p-5">
            <h3 className="text-2xl">Event schedule</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="sr-only">Event date</dt><dd className="flex items-start gap-3"><CalendarDays className="size-4 shrink-0" aria-hidden="true" />{longDate}</dd></div>
              <div><dt className="sr-only">Meeting location</dt><dd className="flex items-start gap-3"><MapPin className="size-4 shrink-0" aria-hidden="true" />{event.location}</dd></div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Check with the organizer for the meeting time and activity plan.</p>
          </div>
        </section>

        <aside aria-label="Organizer and community information" className="space-y-5">
          <section className="rounded-2xl bg-card p-6">
            <p className="eyebrow">Initiative organizer</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-coral font-heading text-2xl text-forest max-md:hidden" aria-hidden="true">{event.hostName.charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="text-xl leading-tight">{event.hostName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Community organizer</p>
              </div>
            </div>
            <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm"><Users className="size-4 shrink-0" aria-hidden="true" />A community-led initiative</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Ask the organizer about the meeting point or volunteer preparation.</p>
          </section>

          {/* <section className="rounded-2xl bg-card p-6 max-md:hidden">
            <p className="eyebrow">Community spirit</p>
            <div className="mt-4 flex gap-2" aria-hidden="true">
              <span className="size-10 rounded-full bg-secondary" />
              <span className="size-10 rounded-full bg-[#fbe7dd]" />
              <span className="size-10 rounded-full bg-[#d3ea86]" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Connect with neighbors who care about the same cause. Small actions make a difference when we come together.</p>
          </section>

          <section className="rounded-2xl bg-[#fbe7dd] p-6 dark:bg-coral/10 max-md:bg-transparent max-md:p-0">
            <p className="eyebrow max-md:hidden">Public event details</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-md:mt-0">Everyone can view this page. Signing in is required to join an event.</p>
          </section> */}
        </aside>
      </div>
    </>
  );
}
