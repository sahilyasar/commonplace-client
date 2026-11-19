"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateEventForm() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch the current user session to get the organizer's email
  const { data: session } = authClient.useSession();
  const user = session?.user;


  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!user) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const eventData = Object.fromEntries(formData.entries());
    // Merge the event data with the organizer's user data, excluding the 'id' field
    const { id, ...restUser } = user;
    const eventwithOrganizer = { ...eventData, ...restUser, user_id: id };

    for (const [name, value] of Object.entries(eventData)) {
      eventData[name] = value.trim();
    }
    const newErrors = {};

    if (!eventData.title) newErrors.title = "Enter an event title.";
    if (!eventData.hostName) newErrors.hostName = "Enter your organization or community group name.";
    if (!eventData.type) newErrors.type = "Choose an event type.";
    if (!eventData.location) newErrors.location = "Enter the event location.";
    if (!eventData.description) newErrors.description = "Describe your event.";

    const eventDate = new Date(eventData.date + "T00:00:00");
    if (!eventData.date || Number.isNaN(eventDate.getTime())) {
      newErrors.date = "Choose an event date.";
    } else if (eventDate <= new Date()) {
      newErrors.date = "Choose a future date, starting tomorrow.";
    }

    try {
      const imageUrl = new URL(eventData.thumbnailUrl);
      if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") {
        newErrors.thumbnailUrl = "Enter an image URL starting with https:// or http://.";
      }
    } catch {
      newErrors.thumbnailUrl = "Enter a valid image URL.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please check the highlighted fields.");
      return;
    }

    console.log("Event form data:", eventData);

    setIsSubmitting(true);
    const toastId = toast.loading("Publishing event...");

    try {
      const res = await fetch("http://localhost:3001/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventwithOrganizer),
      });

      if (!res.ok) {
        toast.error("Failed to submit event. Please try again.", { id: toastId });
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      console.log("Server response:", data);
      toast.success("Event created successfully.", { id: toastId });
      form.reset();
      setErrors({});
    } catch (error) {
      console.error("Event submission failed:", error);
      toast.error("Something went wrong while submitting the event.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }

    
  }

  return (
    <form className="mt-7 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2.5">
        <Label htmlFor="event-title" className="font-bold">Event Title *</Label>
        <Input id="event-title" name="title" placeholder="Your community event title" required maxLength={120} className="event-form-control" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} />
        {errors.title && <p id="title-error" className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="host-name" className="font-bold">Host Name *</Label>
        <Input id="host-name" name="hostName" placeholder="Your organization or community group name" required maxLength={100} className="event-form-control" aria-invalid={Boolean(errors.hostName)} aria-describedby={errors.hostName ? "host-name-error" : undefined} />
        {errors.hostName && <p id="host-name-error" className="text-sm text-destructive">{errors.hostName}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="event-type" className="font-bold">Event Type *</Label>
          <NativeSelect id="event-type" name="type" defaultValue="" required className="event-type-select" aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? "type-error" : undefined}>
            <NativeSelectOption value="" disabled>Choose a cause</NativeSelectOption>
            <NativeSelectOption value="Cleanup">Cleanup</NativeSelectOption>
            <NativeSelectOption value="Plantation">Plantation</NativeSelectOption>
            <NativeSelectOption value="Donation">Donation</NativeSelectOption>
            <NativeSelectOption value="Winter relief">Winter relief</NativeSelectOption>
            <NativeSelectOption value="Food drive">Food drive</NativeSelectOption>
            <NativeSelectOption value="Health Camp">Health Camp</NativeSelectOption>
          </NativeSelect>
          {errors.type && <p id="type-error" className="text-sm text-destructive">{errors.type}</p>}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="event-date" className="font-bold">Event Date *</Label>
          <Input id="event-date" name="date" type="date" required className="event-form-control" onFocus={(event) => { event.currentTarget.min = getTomorrowDate(); }} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : "date-hint"} />
          {errors.date && <p id="date-error" className="text-sm text-destructive">{errors.date}</p>}
          <p id="date-hint" className="sr-only">Select a future date, starting tomorrow.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="event-location" className="font-bold">Event Location *</Label>
        <Input id="event-location" name="location" placeholder="Where will volunteers meet?" required maxLength={180} className="event-form-control" aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "location-error" : undefined} />
        {errors.location && <p id="location-error" className="text-sm text-destructive">{errors.location}</p>}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="thumbnail-url" className="font-bold">Thumbnail Image URL *</Label>
        <Input id="thumbnail-url" name="thumbnailUrl" type="url" placeholder="https://example.com/event-photo.jpg" required className="event-form-control" aria-invalid={Boolean(errors.thumbnailUrl)} aria-describedby={errors.thumbnailUrl ? "thumbnail-error" : undefined} />
        {errors.thumbnailUrl && <p id="thumbnail-error" className="text-sm text-destructive">{errors.thumbnailUrl}</p>}
        <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
          <span className="mr-3 font-medium uppercase">Photo themes:</span>
          <span className="text-[#c45336] dark:text-[#f69a7e]">Winter clothing · Blankets · Cleanup · Tree planting</span>
        </p>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="event-description" className="font-bold">Event Description *</Label>
        <Textarea id="event-description" name="description" placeholder="Explain the purpose, volunteer tasks, supplies, and meeting instructions." required maxLength={3000} className="event-form-control min-h-32 resize-y py-4" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} />
        {errors.description && <p id="description-error" className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary px-5 py-4 text-sm">
        <span className="text-xs font-medium uppercase text-muted-foreground">Organizer email</span>
        <span className="font-medium">{user?.email}</span>
      </div>

      <p className="text-sm text-[#c45336] dark:text-[#f69a7e]">All required fields must be valid. Event date must be in the future.</p>
      <Button type="submit" disabled={isSubmitting} className="h-14 w-full justify-between px-5 font-bold">{isSubmitting ? "Publishing..." : "Publish Community Event"} <ArrowRight aria-hidden="true" /></Button>
    </form>
  );
}
