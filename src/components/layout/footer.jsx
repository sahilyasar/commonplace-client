import CreateEventButton from "@/components/home/create-event-button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest py-14 text-white max-sm:py-10">
      <div className="page-container">
        <div className="grid gap-10 pb-10 sm:grid-cols-3 lg:grid-cols-[2.3fr_1fr_1fr_1fr] max-sm:gap-6 max-sm:pb-6">
          <div className="sm:max-lg:col-span-3">
            <Link href="/" className="brand">commonplace</Link>
            <p className="mt-3 text-sm text-white/70">Small actions. Stronger communities.</p>
          </div>
          <nav aria-label="Explore" className="footer-column max-sm:flex-row max-sm:flex-wrap max-sm:text-xs">
            <h2 className="max-sm:hidden">Explore</h2>
            <Link href="/all-events">Upcoming events</Link>
            <CreateEventButton className="h-auto justify-start border-0 bg-transparent p-0 text-sm font-normal text-white/80 hover:bg-transparent hover:text-white dark:bg-transparent dark:hover:bg-transparent" />
            <Link href="/#how-it-works">How it works</Link>
          </nav>
          <nav aria-label="Community" className="footer-column max-sm:hidden">
            <h2>Community</h2>
            <Link href="/#upcoming-events">Featured events</Link>
            <Link href="/#community">Volunteer photo gallery</Link>
            <Link href="/#newsletter">Newsletter</Link>
          </nav>
          <nav aria-label="Your events" className="footer-column max-sm:hidden">
            <h2>Your events</h2>
            <Link href="/joined-events">Events you joined</Link>
            <Link href="/my-events">Events you host</Link>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/20 pt-7 text-xs text-white/60">
          <p>© 2026 Commonplace. Made for neighbors who care.</p>
          <p>Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
