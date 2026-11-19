"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Menu, Moon, Sun, X } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import ProfileMenu from "./profile-menu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("commonplace-theme");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, []);

  function toggleTheme() {
    const darkMode = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("commonplace-theme", darkMode ? "dark" : "light");
    } catch {
      // Saving the preference is optional.
    }
  }

  return (
    <header className="relative z-20 bg-background">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="page-container flex h-[88px] items-center justify-between gap-4 max-md:h-[70px]">
        <Link href="/" aria-label="Commonplace home" className="brand flex items-center gap-2.5">
          <span className="size-5 rounded-full bg-coral" aria-hidden="true" />
          commonplace
        </Link>
        <Link href="/all-events" className="hidden items-center gap-2 text-sm font-bold md:flex">
          <CalendarDays className="size-4" aria-hidden="true" /> Upcoming Events
        </Link>
        <div className="flex items-center gap-3 max-sm:gap-2">
          <Button variant="secondary" size="icon" className="size-11 rounded-full" onClick={toggleTheme} aria-label="Toggle light and dark theme">
            <Moon className="dark:hidden" aria-hidden="true" />
            <Sun className="hidden dark:block" aria-hidden="true" />
          </Button>
          {user && <ProfileMenu user={user} />}
          {!user && !isPending && (
            <Link href="/login" className={buttonVariants({ className: "hidden h-11 px-5 font-bold lg:inline-flex" })}>
              <ArrowRight aria-hidden="true" /> Log in
            </Link>
          )}
          <Button variant="secondary" size="icon" className="size-11 lg:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-t border-border bg-background px-6 py-5 shadow-sm lg:hidden">
          <div className="page-container flex flex-col items-start gap-5">
            <Link href="/all-events" onClick={() => setMenuOpen(false)}>Upcoming events</Link>
            <Link href="/add-form" onClick={() => setMenuOpen(false)}>Create an event</Link>
            <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            {!user && !isPending && (
              <Link href="/login" className={buttonVariants()} onClick={() => setMenuOpen(false)}>Log in <ArrowRight aria-hidden="true" /></Link>
            )}
          </div>
        </nav>
      )}
      <Toaster position="bottom-center" toastOptions={{ className: "notice-toast" }} />
    </header>
  );
}
