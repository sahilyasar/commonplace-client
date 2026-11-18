"use client";

import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section id="newsletter" className="bg-warm py-20 max-md:py-0">
      <div className="page-container max-md:w-full">
        <div className="mx-auto max-w-[1030px] rounded-[28px] bg-newsletter px-10 py-14 text-center max-md:rounded-none max-md:px-6 max-md:py-12 max-md:text-left">
          <p className="eyebrow">Stay connected</p>
          <h2 className="mt-5 text-4xl max-md:text-3xl">A little good news for your inbox.</h2>
          <p className="mt-5 text-muted-foreground">Community opportunities, gentle reminders and inspiring local stories.</p>
          <div className="mx-auto mt-6 flex max-w-[580px] gap-3 max-sm:flex-col">
            <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
            <Input id="newsletter-email" type="email" autoComplete="email" placeholder="you@example.com" className="h-13 border-0 bg-background px-5" />
            <Button className="h-13 justify-between gap-5 px-6 font-bold" onClick={() => toast("Newsletter subscriptions are coming soon.")}>Subscribe <ArrowRight aria-hidden="true" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
