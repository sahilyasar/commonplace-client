import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateEventForm from "@/components/events/create-event-form";

export const metadata = {
  title: "Create a Community Event | Commonplace",
};

export default function AddFormPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm px-5 py-8 sm:py-10">
      <div className="mx-auto max-w-[760px]">
        <Link href="/all-events" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Upcoming Events
        </Link>

        <section className="rounded-[24px] bg-card p-6 text-card-foreground sm:p-8 lg:p-10" aria-labelledby="create-event-heading">
          <p className="eyebrow">Social service drive</p>
          <h1 id="create-event-heading" className="mt-3 text-3xl leading-tight sm:text-4xl">Create a Community Event</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">Organize a local relief effort, environmental cleanup, or community service drive.</p>
          <CreateEventForm />
        </section>
      </div>
    </main>
  );
}
