"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const eventTypes = ["Cleanup", "Plantation", "Donation", "Winter relief", "Food drive", "Health Camp", "Education"];

export default function EditEvent({ event }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");

  function changeOpen(nextOpen) {
    if (saving) return;
    if (nextOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMinimumDate(tomorrow.toLocaleDateString("en-CA"));
    }
    setOpen(nextOpen);
  }

  async function saveChanges(submitEvent) {
    submitEvent.preventDefault();
    if (saving) return;
    const changes = Object.fromEntries(new FormData(submitEvent.currentTarget));
    for (const [name, value] of Object.entries(changes)) {
      changes[name] = value.trim();
      if (!changes[name]) {
        toast.error("Please fill in every required field.");
        return;
      }
    }
    setSaving(true);

    const token = await getTokenFromClient();
    try {
      const response = await fetch(`http://localhost:3001/update-event/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(changes),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (result.matchedCount !== 1) throw new Error();
      toast.success("Event changes saved.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger className="h-11 rounded-lg bg-slate-200 px-5 text-sm font-bold text-forest">Edit</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:max-w-[740px] sm:p-8" showCloseButton={!saving}>
        <p className="eyebrow">Manage your event</p>
        <DialogTitle className="text-3xl font-bold">Update Your Event</DialogTitle>
        <DialogDescription>Keep your community informed with accurate event details and a clear meeting point.</DialogDescription>
        <form onSubmit={saveChanges}>
          <fieldset disabled={saving} className="grid min-w-0 gap-4 [&_label]:grid [&_label]:gap-2 [&_label]:font-medium">
            <label>Event Title *
              <Input className="event-form-control" name="title" defaultValue={event.title} required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>Event Type *
                <NativeSelect className="event-type-select" name="type" defaultValue={event.type} required>
                  {event.type && !eventTypes.includes(event.type) && <NativeSelectOption>{event.type}</NativeSelectOption>}
                  {eventTypes.map((type) => <NativeSelectOption key={type}>{type}</NativeSelectOption>)}
                </NativeSelect>
              </label>
              <label>Event Date *
                <Input className="event-form-control" name="date" type="date" defaultValue={event.date?.slice(0, 10)} min={minimumDate} required />
              </label>
            </div>
            <label>Event Location *
              <Input className="event-form-control" name="location" defaultValue={event.location} required />
            </label>
            <label>Thumbnail Image URL *
              <Input className="event-form-control" name="thumbnailUrl" type="url" pattern="https?://.+" title="Enter an HTTP or HTTPS image URL." defaultValue={event.thumbnailUrl} required />
            </label>
            <label>Event Description *
              <Textarea className="event-form-control min-h-28 py-3" name="description" defaultValue={event.description} required />
            </label>
            <p className="flex flex-wrap justify-between gap-2 rounded-lg bg-secondary p-4 text-sm">
              <span>Organizer email</span><strong className="break-all">{event.email}</strong>
            </p>
            <p className="text-xs text-muted-foreground">Choose a future event date.</p>
            <Button type="submit" disabled={saving} className="h-12 justify-between px-5 font-bold">
              {saving ? "Saving…" : "Save Event Changes"} <ArrowRight aria-hidden="true" />
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
