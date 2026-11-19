import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function JoinedEventCard({ event, today }) {
  const date = event.date.slice(0, 10);
  const label = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
  let timing = "Past event";
  if (date > today) timing = "Upcoming event";
  if (date === today) timing = "Today";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card">
      {event.thumbnailUrl && <Image src={event.thumbnailUrl} alt={event.title} width={565} height={225}
        unoptimized className="aspect-[1.88] w-full rounded-xl object-cover md:aspect-[2.5]" />}
      <div className="flex flex-1 flex-col p-4 md:px-[22px] md:pt-6 md:pb-8">
        <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase">
          <span className="text-coral md:rounded-full md:bg-secondary md:px-3 md:py-2.5 md:text-foreground">{event.type}</span>
          <time className="text-muted-foreground md:text-coral" dateTime={date}>{label}</time>
        </div>
        <h2 className="mt-3 text-[22px] leading-tight md:text-2xl">{event.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} />{event.location}</p>
        <p className="my-4 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-auto border-t pt-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <strong className="flex items-center gap-1 uppercase"><Check size={14} /> Joined • Confirmed</strong>
            <span className="hidden text-muted-foreground md:inline">{timing}</span>
          </div>
          <Link href={`/all-events/${event._id}`} className={buttonVariants({ className: "mt-4 h-13 w-full justify-between px-5 font-bold" })}>
            View Event <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
