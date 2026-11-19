"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DeleteEvent({ id, title }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/delete-event/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (result.deletedCount !== 1) throw new Error();
      toast.success("Event deleted.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not delete the event. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!deleting) setOpen(nextOpen); }}>
      <DialogTrigger className="h-11 rounded-lg bg-coral/20 px-5 text-sm font-bold text-[#ae412b] dark:text-orange-200">Delete</DialogTrigger>
      <DialogContent showCloseButton={false} className="rounded-2xl p-6 sm:max-w-md">
        <p className="eyebrow flex items-center gap-3"><span aria-hidden="true" className="size-9 rounded-full bg-coral/20" />Irreversible action</p>
        <DialogTitle className="text-2xl font-bold">Delete this event?</DialogTitle>
        <DialogDescription>Are you sure you want to delete “{title}”? This permanently removes the event from upcoming listings and your dashboard.</DialogDescription>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="secondary" disabled={deleting} onClick={() => setOpen(false)} className="h-11 px-4">Cancel</Button>
          <Button disabled={deleting} onClick={confirmDelete} className="h-11 bg-[#b94a3d] px-4 text-white hover:bg-[#983b30]">
            {deleting ? "Deleting…" : "Yes, delete event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
