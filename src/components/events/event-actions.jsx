"use client";

import { ArrowRight, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function EventActions({ event, membershipEmail, initialJoinedId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [joinedId, setJoinedId] = useState(initialJoinedId);
  const joined = Boolean(joinedId);
  const [needsLogin, setNeedsLogin] = useState(false);

  async function handleJoin() {
    if (pending) return;
    setPending(true);
    try {
      const session = await authClient.getSession({ fetchOptions: { cache: "no-store" } });
      if (session.error) {
        toast.error("Could not check your login. Please try again.");
        return;
      }
      const user = session.data?.user;
      if (!user?.email) {
        setNeedsLogin(true);
        return;
      }
      setNeedsLogin(false);
      if (membershipEmail !== user.email) {
        router.refresh();
        toast("Refreshing your event membership. Please try again in a moment.");
        return;
      }
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
      if (!joined && (!event.date || event.date.slice(0, 10) <= today)) {
        toast.error("This event is no longer open to join.");
        return;
      }
      if (joined) {
        const response = await fetch(`http://localhost:3001/leave-event/${encodeURIComponent(joinedId)}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (result.deletedCount !== 1) throw new Error();
        setJoinedId(null);
        toast.success("You left this event.");
      } else {
        const response = await fetch("http://localhost:3001/join-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            name: user.name,
            email: user.email,
            eventId: event._id,
            title: event.title,
            type: event.type,
            date: event.date,
            location: event.location,
            thumbnailUrl: event.thumbnailUrl,
            description: event.description,
            hostName: event.hostName,
          }),
        });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (!result.insertedId) throw new Error();
        setJoinedId(result.insertedId);
        toast.success("You joined this event.");
      }
      router.refresh();
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
          {needsLogin && <p role="status" className="mt-2 text-sm">Please <Link className="font-bold underline" href={`/login?event=${event._id}`}>log in</Link> to manage your place.</p>}
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
