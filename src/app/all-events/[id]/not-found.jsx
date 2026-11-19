import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <main id="main-content" className="flex-1 bg-warm px-5 py-24 text-center">
      <h1 className="text-4xl">This event could not be found.</h1>
      <p className="mt-4 text-muted-foreground">It may have been removed. There are more community initiatives to explore.</p>
      <Link href="/all-events" className={buttonVariants({ className: "mt-7 h-12 px-6" })}>Back to Upcoming Events</Link>
    </main>
  );
}
