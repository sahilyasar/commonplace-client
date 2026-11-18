import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import UpcomingEvents from "@/components/home/upcoming-events";
import Gallery from "@/components/home/gallery";
import Newsletter from "@/components/home/newsletter";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Features />
      <UpcomingEvents />
      <Gallery />
      <Newsletter />
    </main>
  );
}
