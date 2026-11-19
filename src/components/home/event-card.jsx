import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function EventCard({ event, variant = "default" }) {
  const isListing = variant === "listing";
  const eventDate = new Date(event.date);
  const formattedDate = Number.isNaN(eventDate.getTime()) ? event.date : new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(eventDate);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-card text-card-foreground">
      <Image src={event.thumbnailUrl} alt={event.title} unoptimized width={373} height={238} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="aspect-[1.9] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase">
          <span className={isListing ? "py-2 max-sm:text-[#c45336] dark:max-sm:text-[#f69a7e]" : "rounded-full bg-secondary px-3 py-2"}>{event.type}</span>
          <span className={isListing ? "eyebrow font-normal max-sm:text-muted-foreground" : ""}>{formattedDate}</span>
        </div>
        <h3 className="mb-2 text-xl leading-snug">{event.title}</h3>
        <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0" aria-hidden="true" />{event.location}</p>
        <div className="mb-4 flex-1"><p className={`text-sm leading-relaxed text-muted-foreground ${isListing ? "line-clamp-2" : ""}`}>{event.description}</p></div>
        <p className={`mb-3 flex items-center gap-2 border-t border-border pt-3 text-muted-foreground ${isListing ? "text-xs max-sm:hidden" : "text-[11px] font-bold"}`}>
          {isListing ? <Users className="size-3.5 shrink-0" aria-hidden="true" /> : <span className="uppercase">Hosted by</span>}
          {event.hostName}
        </p>
        <Link href={`/all-events/${event._id || event.id}`} className={buttonVariants({ className: `w-full justify-between px-4 font-bold ${isListing ? "h-12 max-sm:h-13" : "h-11"}` })}>
          {isListing ? "View Event" : "View event details"} <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
