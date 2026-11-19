import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import EditEvent from "./edit-event";
import DeleteEvent from "./delete-event";

export default function ManagedEventCard({ event }) {
  const date = new Date(event.date);
  const dateLabel = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card">
      {event.thumbnailUrl && (
        <Image src={event.thumbnailUrl} alt={event.title} width={565} height={220} unoptimized
          className="aspect-[1.88] w-full rounded-xl object-cover md:aspect-[2.57]" />
      )}
      <div className="flex flex-1 flex-col p-4 md:px-[22px] md:pt-5 md:pb-7">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase">
          <span className="text-coral md:rounded-full md:bg-secondary md:px-3.5 md:py-2.5 md:text-foreground">{event.type}</span>
          <time dateTime={event.date} className="hidden text-coral md:inline">{dateLabel}</time>
        </div>
        <h2 className="mt-3 text-[22px] leading-tight md:text-2xl">{event.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} />{event.location}</p>
        <p className="mt-3 mb-3 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-auto border-t pt-3">
          <p className="mb-3 hidden items-center gap-2 text-xs text-muted-foreground md:flex"><Users size={14} />{event.hostName}</p>
          <div className="flex flex-wrap gap-3 md:grid md:grid-cols-[2fr_1fr_1fr]">
            <Link href={`/all-events/${event._id}`} className={buttonVariants({ variant: "secondary", className: "h-11 px-5 font-bold" })}>View</Link>
            <EditEvent event={event} />
            <DeleteEvent id={event._id} title={event.title} />
          </div>
        </div>
      </div>
    </article>
  );
}
