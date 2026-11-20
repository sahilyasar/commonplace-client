"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, List, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ProfileAvatar({ user }) {
  return (
    <Avatar size="lg" className="bg-coral">
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback className="bg-coral" />
    </Avatar>
  );
}

export default function ProfileMenu({ user }) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error("Could not log out. Please try again.");
        return;
      }
      toast.success("Logged out.");
    } catch {
      toast.error("Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const itemStyle = "min-h-11 gap-3 px-3 [&_svg]:text-coral";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Profile menu" className="flex items-center gap-2 rounded-full text-sm font-bold">
          <ProfileAvatar user={user} />
          <span className="hidden sm:inline">{user.name}</span>
          <ChevronDown aria-hidden="true" className="hidden size-3 sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-72 max-w-[calc(100vw-24px)] rounded-2xl p-3">
          <div className="flex items-center gap-3 p-1">
            <ProfileAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate font-bold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/add-form" />} className={itemStyle}>
            <Plus /> Create Event
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/my-events" />} className={itemStyle}>
            <List /> Manage Events
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/joined-events" />} className={itemStyle}>
            <Check /> Joined Events
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={itemStyle} onClick={handleLogout} disabled={loggingOut}>
            <ArrowRight /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="hidden h-11 bg-coral/15 px-4 font-bold text-foreground hover:bg-coral/25 lg:inline-flex" onClick={handleLogout} disabled={loggingOut}>
        {loggingOut ? "Logging out…" : "Log out"}
      </Button>
    </>
  );
}
