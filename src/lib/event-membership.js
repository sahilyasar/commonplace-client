"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { auth, db } from "@/lib/auth";

export async function changeMembership(eventId, join) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { loginRequired: true };
  if (!ObjectId.isValid(eventId) || typeof join !== "boolean") {
    return { error: "Invalid event." };
  }

  const email = session.user.email;
  const memberships = db.collection("joined_events");
  try {
    if (join) {
      const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
      if (!event || !event.date || event.date.slice(0, 10) <= today) {
        return { error: "This event is no longer open to join." };
      }
      // A stable key keeps repeated join requests from creating duplicate commitments.
      await memberships.updateOne({ _id: { eventId, email } }, {
        $setOnInsert: { eventId, email },
      }, { upsert: true });
    } else {
      await memberships.deleteMany({ eventId, email });
    }
  } catch {
    return { error: "Could not update your commitment. Please try again." };
  }
  revalidatePath("/joined-events");
  revalidatePath(`/all-events/${eventId}`);
  return { joined: join };
}
