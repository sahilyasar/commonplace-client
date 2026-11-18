"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/home/event-card";

const categories = ["All", "Donation", "Cleanup", "Plantation", "Winter Relief", "Food Drive", "Health Camp", "Education"];
const eventsPerPage = 9;

export default function EventsBrowser({ events = [], error = "" }) {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchText = search.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    const matchesCategory = category === "All" || event.type.toLowerCase() === category.toLowerCase();
    const matchesSearch = `${event.title} ${event.location} ${event.hostName}`.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const visibleEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  function changePage(page) {
    setCurrentPage(page);
    document.getElementById("events-browser").scrollIntoView({ block: "start" });
  }

  function clearFilters() {
    setCategory("All");
    setSearch("");
    setCurrentPage(1);
  }

  return (
    <section id="events-browser" aria-label="Browse upcoming events">
      <div className="mt-7 flex items-center justify-between gap-6 border-t border-border pt-7 max-xl:flex-col max-xl:items-stretch max-md:mt-5 max-md:gap-5 max-md:border-0 max-md:pt-0">
        <div role="group" aria-label="Filter by event type" className="flex flex-wrap gap-2 max-md:order-2">
          {categories.map((item) => (
            <Button key={item} variant={category === item ? "default" : "secondary"} aria-pressed={category === item} className={`h-9 rounded-full px-4 text-xs font-bold ${category === item ? "" : "bg-background hover:bg-secondary max-md:bg-secondary"}`} onClick={() => { setCategory(item); setCurrentPage(1); }}>
              {item}
            </Button>
          ))}
        </div>

        <div className="relative w-64 shrink-0 max-xl:w-full">
          <label htmlFor="event-search" className="sr-only">Search events or areas</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="event-search" type="search" placeholder="Search events or areas..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} className="h-12 rounded-xl border-0 bg-background pl-10 pr-4 text-sm max-md:h-13" />
        </div>
      </div>

      <p role="status" className="sr-only">{filteredEvents.length} upcoming events found.</p>

      {error ? (
        <div className="mt-10 rounded-2xl bg-card px-6 py-14 text-center" role="alert">
          <h2 className="text-2xl">Events are taking a little longer.</h2>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => router.refresh()}>Try again</Button>
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-card px-6 py-14 text-center">
          <h2 className="text-2xl">{search || category !== "All" ? "No matching events" : "More good things are on the way."}</h2>
          <p className="mt-3 text-muted-foreground">{search || category !== "All" ? "Try another cause or search a different neighborhood." : "There are no upcoming events yet. Check back soon for new ways to help."}</p>
          {(search || category !== "All") && <Button variant="outline" className="mt-5" onClick={clearFilters}>Clear filters</Button>}
        </div>
      ) : (
        <div id="event-results" className="mt-16 grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 max-md:mt-5">
          {visibleEvents.map((event) => <EventCard key={event._id || event.id} event={event} variant="listing" />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Event pages" className="mt-6 flex flex-wrap items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button key={index + 1} variant={currentPage === index + 1 ? "default" : "secondary"} aria-label={`Page ${index + 1}`} aria-current={currentPage === index + 1 ? "page" : undefined} className="size-10 rounded-full" onClick={() => changePage(index + 1)}>
              {String(index + 1).padStart(2, "0")}
            </Button>
          ))}
          <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next page <ArrowRight aria-hidden="true" /></Button>
        </nav>
      )}
    </section>
  );
}
