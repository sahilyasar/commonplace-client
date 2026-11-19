"use client";

import { ArrowRight, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeMembership } from "@/lib/event-membership";

export default function EventActions({ eventId, signedIn, joined }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleJoin() {
    if (!signedIn) return router.push("/login");
    if (pending) return;
    setPending(true);
    try {
      const result = await changeMembership(eventId, !joined);
      if (result.loginRequired) return router.push("/login");
      if (result.error) return toast.error(result.error);
      toast.success(result.joined ? "You joined this event." : "You left this event.");
    } catch {
      toast.error("Could not update your commitment. Please try again.");
    } finally {
      setPending(false);
    }
  }
  async function shareEvent() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied. Share it with your neighbors!");
    } catch {
      toast.error("Couldn't copy the link. You can copy it from the address bar.");
    }
  }

  return (
    <section className="mt-5 flex items-center justify-between gap-5 rounded-[20px] bg-card p-6 max-md:flex-col max-md:items-stretch max-md:p-5" aria-label="Join this event">
      <div className="flex items-center gap-4">
        <span className="size-12 shrink-0 rounded-full bg-[#d3ea86] max-md:hidden" aria-hidden="true" />
        <div>
          <h2 className="text-[22px]">Volunteers welcome</h2>
          <p className="mt-1 text-sm text-muted-foreground">{joined ? "Your place at this event is confirmed." : "Join your neighbors for this local initiative."}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-3">
        <Button variant="secondary" aria-label="Share this event" className="h-14 gap-4 px-5 font-bold max-md:px-4 max-sm:w-12 max-sm:px-0" onClick={shareEvent}><span className="max-sm:sr-only">Share</span><Share2 aria-hidden="true" /></Button>
        <Button className="h-14 justify-between gap-6 px-6 font-bold max-md:flex-1" disabled={pending} onClick={handleJoin}>
          {pending ? "Updating…" : joined ? "Leave Event" : "Join Event"} <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
